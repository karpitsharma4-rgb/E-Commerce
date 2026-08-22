/**
 * middleware/authMiddleware.js — Authentication & Authorization Guards
 *
 * protect   — Verifies JWT Bearer token; attaches req.user
 * adminOnly — Ensures the authenticated user has the 'admin' role
 *
 * Usage:
 *   router.get('/admin-route', protect, adminOnly, controller);
 *   router.get('/user-route', protect, controller);
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect — JWT Authentication Middleware
 *
 * Reads the Bearer token from the Authorization header,
 * verifies it, fetches the corresponding user from DB,
 * and attaches the user object to req.user.
 */
const protect = async (req, res, next) => {
  let token;

  // Extract Bearer token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  try {
    // Verify token signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (excluding password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.',
      });
    }

    if (!req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Contact support.',
      });
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired. Please log in again.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid token. Please log in again.',
    });
  }
};

/**
 * adminOnly — Role-Based Authorization Middleware
 *
 * Must be used AFTER protect middleware.
 * Allows requests only from users with the 'admin' role.
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access forbidden. Admin privileges required.',
  });
};

module.exports = { protect, adminOnly };
