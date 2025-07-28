const express = require('express');
const { body, validationResult, query } = require('express-validator');
const db = require('../config/database');
const { authenticateToken, requireStructure } = require('../middleware/auth');

const router = express.Router();

// Get all approved structures (public)
router.get('/', (req, res) => {
  db.all('SELECT * FROM structures', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get current user's structure
router.get('/my/profile', authenticateToken, requireStructure, async (req, res) => {
  try {
    const result = await db.get(`
      SELECT st.*, u.full_name as owner_name, u.email as owner_email
      FROM structures st
      LEFT JOIN users u ON st.user_id = u.id
      WHERE st.user_id = ?
    `, [req.user.id]);

    if (!result) {
      return res.status(404).json({ error: 'Structure profile not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching my structure:', error);
    res.status(500).json({ error: 'Failed to fetch structure profile' });
  }
});

module.exports = router;
