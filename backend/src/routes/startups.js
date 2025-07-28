const express = require('express');
const { body, validationResult, query } = require('express-validator');
const db = require('../config/database');
const { authenticateToken, requireStartup, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all approved startups (public)
router.get('/', [
  query('search').optional().trim(),
  query('industry').optional().trim(),
  query('stage').optional().trim(),
  query('location').optional().trim()
], (req, res) => {
  const { search, industry, stage, location } = req.query;
  console.log('GET /startups query:', req.query);
  let query_text = `
    SELECT s.*, u.full_name as owner_name, u.email as owner_email,
           array_agg(DISTINCT p.id) as product_ids,
           array_agg(DISTINCT p.name) as product_names
    FROM startups s
    LEFT JOIN users u ON s.user_id = u.id
    LEFT JOIN products p ON s.id = p.startup_id AND p.is_active = true
    WHERE s.is_approved = true
  `;
  const params = [];
  let paramCount = 0;

  if (search) {
    paramCount++;
    query_text += ` AND (s.name ILIKE $${paramCount} OR s.description ILIKE $${paramCount})`;
    params.push(`%${search}%`);
  }

  if (industry) {
    paramCount++;
    query_text += ` AND s.industry = $${paramCount}`;
    params.push(industry);
  }

  if (stage) {
    paramCount++;
    query_text += ` AND s.stage = $${paramCount}`;
    params.push(stage);
  }

  if (location) {
    paramCount++;
    query_text += ` AND s.location ILIKE $${paramCount}`;
    params.push(`%${location}%`);
  }

  query_text += ` GROUP BY s.id, u.full_name, u.email ORDER BY s.created_at DESC`;

  db.all(query_text, params, (err, rows) => {
    if (err) {
      console.error('Error fetching startups:', err);
      return res.status(500).json({ error: 'Failed to fetch startups' });
    }
    
    // Transform data to include products array
    const startups = rows.map(row => ({
      ...row,
      products: row.product_ids[0] ? row.product_ids.map((id, index) => ({
        id,
        name: row.product_names[index]
      })) : []
    }));

    res.json(startups);
  });
});

// Get startup by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get(`
    SELECT s.*, u.full_name as owner_name, u.email as owner_email
    FROM startups s
    LEFT JOIN users u ON s.user_id = u.id
    WHERE s.id = ? AND s.is_approved = true
  `, [id], (err, row) => {
    if (err) {
      console.error('Error fetching startup:', err);
      return res.status(500).json({ error: 'Failed to fetch startup' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Startup not found' });
    }

    // Get products for this startup
    db.all(
      'SELECT * FROM products WHERE startup_id = ? AND is_active = true ORDER BY created_at DESC',
      [id],
      (err, products) => {
        if (err) {
          console.error('Error fetching products:', err);
          return res.status(500).json({ error: 'Failed to fetch products' });
        }

        const startup = {
          ...row,
          products: products
        };

        res.json(startup);
      }
    );
  });
});

// Get current user's startup
router.get('/my/profile', authenticateToken, requireStartup, (req, res) => {
  db.get(`
    SELECT s.*, u.full_name as owner_name, u.email as owner_email
    FROM startups s
    LEFT JOIN users u ON s.user_id = u.id
    WHERE s.user_id = ?
  `, [req.user.id], (err, row) => {
    if (err) {
      console.error('Error fetching my startup:', err);
      return res.status(500).json({ error: 'Failed to fetch startup profile' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Startup profile not found' });
    }

    // Get products for this startup
    db.all(
      'SELECT * FROM products WHERE startup_id = ? ORDER BY created_at DESC',
      [row.id],
      (err, products) => {
        if (err) {
          console.error('Error fetching products:', err);
          return res.status(500).json({ error: 'Failed to fetch products' });
        }

        const startup = {
          ...row,
          products: products
        };

        res.json(startup);
      }
    );
  });
});

// Create startup profile
router.post('/', authenticateToken, requireStartup, [
  body('name').notEmpty().trim(),
  body('description').optional().trim(),
  body('website').optional().isURL(),
  body('industry').optional().trim(),
  body('stage').optional().trim(),
  body('location').optional().trim()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name,
    description,
    logo_url,
    website,
    founded_date,
    industry,
    stage,
    location,
    team_size
  } = req.body;

  // Check if startup already exists for this user
  db.get(
    'SELECT id FROM startups WHERE user_id = ?',
    [req.user.id],
    (err, row) => {
      if (err) {
        console.error('Error checking existing startup:', err);
        return res.status(500).json({ error: 'Failed to check existing startup' });
      }

      if (row) {
        return res.status(400).json({ error: 'Startup profile already exists' });
      }

      db.run(`
        INSERT INTO startups (user_id, name, description, logo_url, website, founded_date, industry, stage, location, team_size)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [req.user.id, name, description, logo_url, website, founded_date, industry, stage, location, team_size], function(err) {
        if (err) {
          console.error('Error creating startup:', err);
          return res.status(500).json({ error: 'Failed to create startup profile' });
        }
        res.status(201).json({
          success: true,
          message: 'Startup profile created successfully',
          startup: this.lastID
        });
      });
    }
  );
});

// Update startup profile
router.put('/my/profile', authenticateToken, requireStartup, [
  body('name').optional().notEmpty().trim(),
  body('description').optional().trim(),
  body('website').optional().isURL()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const updates = req.body;
  const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
  const values = [req.user.id, ...Object.values(updates)];

  db.run(`
    UPDATE startups 
    SET ${setClause}, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `, values, (err) => {
    if (err) {
      console.error('Error updating startup:', err);
      return res.status(500).json({ error: 'Failed to update startup profile' });
    }

    db.get(`
      SELECT * FROM startups WHERE user_id = ?
    `, [req.user.id], (err, row) => {
      if (err) {
        console.error('Error fetching updated startup:', err);
        return res.status(500).json({ error: 'Failed to fetch updated startup' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Startup profile not found' });
      }
      res.json({
        success: true,
        message: 'Startup profile updated successfully',
        startup: row
      });
    });
  });
});

// Get startup KPIs
router.get('/my/kpis', authenticateToken, requireStartup, (req, res) => {
  // Get startup ID
  db.get(
    'SELECT id FROM startups WHERE user_id = ?',
    [req.user.id],
    (err, row) => {
      if (err) {
        console.error('Error fetching startup ID:', err);
        return res.status(500).json({ error: 'Failed to fetch startup ID' });
      }

      if (!row) {
        return res.status(404).json({ error: 'Startup profile not found' });
      }

      const startupId = row.id;

      // Get KPI data in parallel
      Promise.all([
        new Promise((resolve, reject) => {
          db.get('SELECT COUNT(*) as count FROM products WHERE startup_id = ?', [startupId], (err, row) => {
            if (err) reject(err);
            resolve(row);
          });
        }),
        new Promise((resolve, reject) => {
          db.get('SELECT COUNT(*) as count, SUM(total_amount) as revenue FROM orders WHERE startup_id = ? AND status = ?', [startupId, 'delivered'], (err, row) => {
            if (err) reject(err);
            resolve(row);
          });
        }),
        new Promise((resolve, reject) => {
          db.get('SELECT SUM(amount) as total FROM commissions WHERE startup_id = ? AND is_paid = true', [startupId], (err, row) => {
            if (err) reject(err);
            resolve(row);
          });
        }),
        new Promise((resolve, reject) => {
          db.get('SELECT COUNT(*) as count FROM startup_structure_links WHERE startup_id = ? AND status = ?', [startupId, 'accepted'], (err, row) => {
            if (err) reject(err);
            resolve(row);
          });
        })
      ]).then(([productsResult, ordersResult, commissionsResult, structureLinksResult]) => {
        const kpis = {
          totalProducts: parseInt(productsResult.count),
          totalOrders: parseInt(ordersResult.count),
          totalRevenue: parseFloat(ordersResult.revenue) || 0,
          commissionPaid: parseFloat(commissionsResult.total) || 0,
          structuresLinked: parseInt(structureLinksResult.count),
          averageProductPrice: 0 // Calculate if needed
        };
        res.json(kpis);
      }).catch(err => {
        console.error('Error fetching startup KPIs:', err);
        res.status(500).json({ error: 'Failed to fetch KPIs' });
      });
    }
  );
});

module.exports = router;
