/**
 * middleware/errorHandler.js — Global Error Handling Middleware
 *
 * notFound    — 404 handler for unmatched routes
 * errorHandler — Centralized error formatter; handles Mongoose and JWT errors
 *
 * All controllers should call next(error) to route errors here.
 */

/**
 * notFound — Handles requests to undefined routes
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * errorHandler — Central error response formatter
 *
 * Handles:
 *  - Mongoose CastError    (invalid ObjectId)
 *  - Mongoose duplicate key (E11000)
 *  - Mongoose ValidationError
 *  - JWT errors
 *  - Custom application errors
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // ── Mongoose: Invalid ObjectId ──────────────────────────────────────────
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // ── Mongoose: Duplicate key (e.g., unique email) ────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    statusCode = 409;
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
  }

  // ── Mongoose: Validation errors (required fields, enum, etc.) ──────────
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // ── JWT: Invalid signature ──────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token.';
  }

  // ── JWT: Token expired ──────────────────────────────────────────────────
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired. Please log in again.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Show stack trace only in development for easier debugging
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
