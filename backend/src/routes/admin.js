const express = require('express');
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

// Get pending approvals
router.get('/pending-approvals', async (req, res) => {
  try {
    // Get pending startups
    db.all(`
      SELECT s.*, u.full_name as owner_name, u.email as owner_email
      FROM startups s
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.is_approved = false
      ORDER BY s.created_at DESC
    `, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      // Get pending structures
      db.all(`
        SELECT st.*, u.full_name as owner_name, u.email as owner_email
        FROM structures st
        LEFT JOIN users u ON st.user_id = u.id
        WHERE st.is_approved = false
        ORDER BY st.created_at DESC
      `, [], (err2, rows2) => {
        if (err2) {
          return res.status(500).json({ error: err2.message });
        }
        res.json({
          startups: rows,
          structures: rows2
        });
      });
    });
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    res.status(500).json({ error: 'Failed to fetch pending approvals' });
  }
});

// Approve/reject startup
router.post('/startups/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body; // true for approve, false for reject

    db.run(`
      UPDATE startups SET is_approved = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING *
    `, [approved, id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (row === null) {
        return res.status(404).json({ error: 'Startup not found' });
      }
      res.json({
        success: true,
        message: `Startup ${approved ? 'approved' : 'rejected'} successfully`,
        startup: row
      });
    });
  } catch (error) {
    console.error('Error updating startup approval:', error);
    res.status(500).json({ error: 'Failed to update startup approval' });
  }
});

// Approve/reject structure
router.post('/structures/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    db.run(`
      UPDATE structures SET is_approved = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING *
    `, [approved, id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (row === null) {
        return res.status(404).json({ error: 'Structure not found' });
      }
      res.json({
        success: true,
        message: `Structure ${approved ? 'approved' : 'rejected'} successfully`,
        structure: row
      });
    });
  } catch (error) {
    console.error('Error updating structure approval:', error);
    res.status(500).json({ error: 'Failed to update structure approval' });
  }
});

// Get platform analytics
router.get('/analytics', async (req, res) => {
  try {
    const [
      usersResult,
      startupsResult,
      structuresResult,
      productsResult,
      ordersResult,
      revenueResult
    ] = await Promise.all([
      new Promise((resolve, reject) => {
        db.all('SELECT role, COUNT(*) as count FROM users GROUP BY role', [], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      }),
      new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE is_approved = true) as approved FROM startups', [], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      }),
      new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE is_approved = true) as approved FROM structures', [], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      }),
      new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE is_active = true) as active FROM products', [], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      }),
      new Promise((resolve, reject) => {
        db.all('SELECT COUNT(*) as total, status, COUNT(*) as status_count FROM orders GROUP BY status', [], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      }),
      new Promise((resolve, reject) => {
        db.get('SELECT SUM(total_amount) as total_revenue FROM orders WHERE status = ?', ['delivered'], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      })
    ]);

    const analytics = {
      users: usersResult.reduce((acc, row) => {
        acc[row.role] = parseInt(row.count);
        return acc;
      }, {}),
      startups: {
        total: parseInt(startupsResult.total),
        approved: parseInt(startupsResult.approved)
      },
      structures: {
        total: parseInt(structuresResult.total),
        approved: parseInt(structuresResult.approved)
      },
      products: {
        total: parseInt(productsResult.total),
        active: parseInt(productsResult.active)
      },
      orders: ordersResult.reduce((acc, row) => {
        acc[row.status] = parseInt(row.status_count);
        return acc;
      }, {}),
      revenue: {
        total: parseFloat(revenueResult.total_revenue) || 0
      }
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    db.all(`
      SELECT id, email, full_name, role, is_approved, created_at
      FROM users
      ORDER BY created_at DESC
    `, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user approval status
router.post('/users/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    db.run(`
      UPDATE users SET is_approved = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING id, email, full_name, role, is_approved
    `, [approved, id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (row === null) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({
        success: true,
        message: `User ${approved ? 'approved' : 'suspended'} successfully`,
        user: row
      });
    });
  } catch (error) {
    console.error('Error updating user approval:', error);
    res.status(500).json({ error: 'Failed to update user approval' });
  }
});

module.exports = router;
