const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Register endpoint
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('full_name').notEmpty().trim(),
  body('role').isIn(['client', 'startup', 'structure'])
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      email, 
      password, 
      full_name, 
      phone, 
      country, 
      role,
      startup_data,
      structure_data 
    } = req.body;

    // Check if user already exists
    const existingUser = await db.get(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Auto-approve clients, require approval for startups and structures
    const isApproved = role === 'client';

    // Begin transaction
    await db.run('BEGIN');

    try {
      // Create user
      const userResult = await db.get(
        `INSERT INTO users (email, password_hash, full_name, phone, country, role, is_approved) 
         VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id, email, full_name, role, is_approved`,
        [email, passwordHash, full_name, phone, country, role, isApproved]
      );

      const user = userResult;

      // Create role-specific profile
      if (role === 'startup' && startup_data) {
        await db.run(
          `INSERT INTO startups (user_id, name, description, website, logo_url) 
           VALUES (?, ?, ?, ?, ?)`,
          [
            user.id,
            startup_data.name,
            startup_data.description,
            startup_data.website,
            startup_data.logo_url
          ]
        );
      } else if (role === 'structure' && structure_data) {
        await db.run(
          `INSERT INTO structures (user_id, name, description, structure_type, website, logo_url) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            user.id,
            structure_data.name,
            structure_data.description,
            structure_data.structure_type,
            structure_data.website,
            structure_data.logo_url
          ]
        );
      }

      await db.run('COMMIT');

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: role === 'client' 
          ? 'Account created successfully' 
          : 'Account created successfully. Awaiting admin approval.',
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          is_approved: user.is_approved
        },
        token
      });

    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Login endpoint
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Get user from database
    const result = await db.get(
      'SELECT id, email, password_hash, full_name, role, is_approved FROM users WHERE email = ?',
      [email]
    );

    if (!result) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result;

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user is approved (except for admin and client)
    if (!user.is_approved && user.role !== 'admin' && user.role !== 'client') {
      return res.status(403).json({ 
        error: 'Your account is pending approval. Please contact support.' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Logged in successfully',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        is_approved: user.is_approved
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

// Get current user endpoint
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    const result = await db.get(
      'SELECT id, email, full_name, role, is_approved, created_at FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
