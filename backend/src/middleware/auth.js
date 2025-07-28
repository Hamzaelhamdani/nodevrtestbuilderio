const jwt = require('jsonwebtoken');
const db = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user from database to ensure they still exist and are active
    db.get(
      'SELECT id, email, full_name, role, is_approved FROM users WHERE id = ?',
      [decoded.userId],
      (err, user) => {
        if (err) {
          console.error('Token verification error:', err);
          return res.status(403).json({ error: 'Invalid or expired token' });
        }
        if (!user) {
          return res.status(401).json({ error: 'User not found' });
        }
        // Check if user is approved (except for admin and client roles)
        if (!user.is_approved && user.role !== 'admin' && user.role !== 'client') {
          return res.status(403).json({ error: 'Account pending approval' });
        }
        req.user = user;
        next();
      }
    );
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Middleware to check user roles
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: `Access denied. Required role: ${allowedRoles.join(' or ')}` 
      });
    }

    next();
  };
};

// Middleware for admin-only routes
const requireAdmin = requireRole('admin');

// Middleware for startup-only routes
const requireStartup = requireRole('startup');

// Middleware for structure-only routes
const requireStructure = requireRole('structure');

// Middleware for client-only routes
const requireClient = requireRole('client');

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireStartup,
  requireStructure,
  requireClient,
  JWT_SECRET
};
