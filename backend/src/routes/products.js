const express = require('express');
const { body, validationResult, query } = require('express-validator');
const db = require('../config/database');
const { authenticateToken, requireStartup } = require('../middleware/auth');

const router = express.Router();

// Get all active products (public)
router.get('/', [
  query('search').optional().trim(),
  query('category').optional().trim(),
  query('min_price').optional().isFloat({ min: 0 }),
  query('max_price').optional().isFloat({ min: 0 }),
  query('startup_id').optional().isInt()
], (req, res) => {
  const { search, category, min_price, max_price, startup_id } = req.query;
  
  let query_text = `
    SELECT p.*, s.name as startup_name, s.logo_url as startup_logo
    FROM products p
    LEFT JOIN startups s ON p.startup_id = s.id
    WHERE p.is_active = true AND s.is_approved = true
  `;
  const params = [];
  let paramCount = 0;

  if (search) {
    paramCount++;
    query_text += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
    params.push(`%${search}%`);
  }

  if (category) {
    paramCount++;
    query_text += ` AND p.category = $${paramCount}`;
    params.push(category);
  }

  if (min_price) {
    paramCount++;
    query_text += ` AND p.price >= $${paramCount}`;
    params.push(parseFloat(min_price));
  }

  if (max_price) {
    paramCount++;
    query_text += ` AND p.price <= $${paramCount}`;
    params.push(parseFloat(max_price));
  }

  if (startup_id) {
    paramCount++;
    query_text += ` AND p.startup_id = $${paramCount}`;
    params.push(parseInt(startup_id));
  }

  query_text += ` ORDER BY p.created_at DESC`;

  db.all(query_text, params, (err, rows) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    res.json(rows);
  });
});

// Get product by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get(`
    SELECT p.*, s.name as startup_name, s.logo_url as startup_logo, s.description as startup_description
    FROM products p
    LEFT JOIN startups s ON p.startup_id = s.id
    WHERE p.id = ? AND p.is_active = true AND s.is_approved = true
  `, [id], (err, row) => {
    if (err) {
      console.error('Error fetching product:', err);
      return res.status(500).json({ error: 'Failed to fetch product' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(row);
  });
});

// Get current startup's products
router.get('/my/list', authenticateToken, requireStartup, (req, res) => {
  // Get startup ID
  db.get(
    'SELECT id FROM startups WHERE user_id = ?',
    [req.user.id],
    (err, row) => {
      if (err) {
        console.error('Error fetching startup:', err);
        return res.status(500).json({ error: 'Failed to fetch startup profile' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Startup profile not found' });
      }

      const startupId = row.id;

      db.all(
        'SELECT * FROM products WHERE startup_id = ? ORDER BY created_at DESC',
        [startupId],
        (err, rows) => {
          if (err) {
            console.error('Error fetching my products:', err);
            return res.status(500).json({ error: 'Failed to fetch products' });
          }
          res.json(rows);
        }
      );
    }
  );
});

// Create product
router.post('/', authenticateToken, requireStartup, [
  body('name').notEmpty().trim(),
  body('description').optional().trim(),
  body('price').isFloat({ min: 0 }),
  body('category').optional().trim(),
  body('stock_quantity').optional().isInt({ min: 0 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Get startup ID
  db.get(
    'SELECT id FROM startups WHERE user_id = ?',
    [req.user.id],
    (err, row) => {
      if (err) {
        console.error('Error fetching startup for product:', err);
        return res.status(500).json({ error: 'Failed to fetch startup profile' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Startup profile not found' });
      }

      const startupId = row.id;

      const {
        name,
        description,
        price,
        category,
        image_urls,
        stock_quantity
      } = req.body;

      db.run(`
        INSERT INTO products (startup_id, name, description, price, category, image_urls, stock_quantity)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [startupId, name, description, price, category, image_urls || [], stock_quantity || 0], function(err) {
        if (err) {
          console.error('Error creating product:', err);
          return res.status(500).json({ error: 'Failed to create product' });
        }
        db.get('SELECT * FROM products WHERE id = ?', [this.lastID], (err, row) => {
          if (err) {
            console.error('Error getting created product:', err);
            return res.status(500).json({ error: 'Failed to get created product' });
          }
          res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product: row
          });
        });
      });
    }
  );
});

// Update product
router.put('/:id', authenticateToken, requireStartup, [
  body('name').optional().notEmpty().trim(),
  body('price').optional().isFloat({ min: 0 }),
  body('stock_quantity').optional().isInt({ min: 0 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  
  // Get startup ID
  db.get(
    'SELECT id FROM startups WHERE user_id = ?',
    [req.user.id],
    (err, row) => {
      if (err) {
        console.error('Error fetching startup for update:', err);
        return res.status(500).json({ error: 'Failed to fetch startup profile' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Startup profile not found' });
      }

      const startupId = row.id;

      const updates = req.body;
      const setClause = Object.keys(updates).map((key, index) => `${key} = ?`).join(', ');
      const values = [id, startupId, ...Object.values(updates)];

      db.run(`
        UPDATE products 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND startup_id = ?
      `, values, function(err) {
        if (err) {
          console.error('Error updating product:', err);
          return res.status(500).json({ error: 'Failed to update product' });
        }
        db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
          if (err) {
            console.error('Error getting updated product:', err);
            return res.status(500).json({ error: 'Failed to get updated product' });
          }
          if (!row) {
            return res.status(404).json({ error: 'Product not found or unauthorized' });
          }
          res.json({
            success: true,
            message: 'Product updated successfully',
            product: row
          });
        });
      });
    }
  );
});

// Delete product
router.delete('/:id', authenticateToken, requireStartup, (req, res) => {
  const { id } = req.params;
  
  // Get startup ID
  db.get(
    'SELECT id FROM startups WHERE user_id = ?',
    [req.user.id],
    (err, row) => {
      if (err) {
        console.error('Error fetching startup for delete:', err);
        return res.status(500).json({ error: 'Failed to fetch startup profile' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Startup profile not found' });
      }

      const startupId = row.id;

      db.run(
        'DELETE FROM products WHERE id = ? AND startup_id = ? RETURNING id',
        [id, startupId],
        function(err) {
          if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).json({ error: 'Failed to delete product' });
          }
          if (this.changes === 0) {
            return res.status(404).json({ error: 'Product not found or unauthorized' });
          }
          res.json({
            success: true,
            message: 'Product deleted successfully'
          });
        }
      );
    }
  );
});

module.exports = router;
