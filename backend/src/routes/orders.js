const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Create order (clients only)
router.post('/', authenticateToken, requireRole('client'), [
  body('product_id').isInt(),
  body('quantity').isInt({ min: 1 }),
  body('delivery_address').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { product_id, quantity, delivery_address, notes } = req.body;

    // Get product details
    db.get('SELECT p.*, s.id as startup_id FROM products p LEFT JOIN startups s ON p.startup_id = s.id WHERE p.id = ? AND p.is_active = true', [product_id], (err, product) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!product) {
        return res.status(404).json({ error: 'Product not found or not available' });
      }

      const totalAmount = product.price * quantity;

      db.run(`
        INSERT INTO orders (client_id, startup_id, product_id, quantity, unit_price, total_amount, delivery_address, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [req.user.id, product.startup_id, product_id, quantity, product.price, totalAmount, delivery_address, notes], function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        db.get('SELECT * FROM orders WHERE id = ?', [this.lastID], (err, order) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order: order
          });
        });
      });
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get user's orders
router.get('/my', authenticateToken, async (req, res) => {
  try {
    let query_text;
    let params;

    if (req.user.role === 'client') {
      // Get orders placed by this client
      query_text = `
        SELECT o.*, p.name as product_name, p.image_urls as product_images,
               s.name as startup_name
        FROM orders o
        LEFT JOIN products p ON o.product_id = p.id
        LEFT JOIN startups s ON o.startup_id = s.id
        WHERE o.client_id = ?
        ORDER BY o.created_at DESC
      `;
      params = [req.user.id];
    } else if (req.user.role === 'startup') {
      // Get orders for this startup's products
      db.get('SELECT id FROM startups WHERE user_id = ?', [req.user.id], (err, startup) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (!startup) {
          return res.json([]);
        }
        
        query_text = `
          SELECT o.*, p.name as product_name, p.image_urls as product_images,
                 u.full_name as client_name, u.email as client_email
          FROM orders o
          LEFT JOIN products p ON o.product_id = p.id
          LEFT JOIN users u ON o.client_id = u.id
          WHERE o.startup_id = ?
          ORDER BY o.created_at DESC
        `;
        params = [startup.id];

        db.all(query_text, params, (err, orders) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json(orders);
        });
      });
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;
