const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    db.get(
      'SELECT id, email, full_name, phone, country, role, is_approved, avatar_url, bio, website, linkedin_url, created_at FROM users WHERE id = ?',
      [req.user.id],
      (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (!row) {
          return res.status(404).json({ error: 'User not found' });
        }
        res.json(row);
      }
    );
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const allowedFields = ['full_name', 'phone', 'country', 'avatar_url', 'bio', 'website', 'linkedin_url'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const setClause = Object.keys(updates).map((key, index) => `${key} = ?`).join(', ');
    const values = [req.user.id, ...Object.values(updates)];

    db.run(`
      UPDATE users 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      RETURNING id, email, full_name, phone, country, role, is_approved, avatar_url, bio, website, linkedin_url
    `, values, (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: row
      });
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
