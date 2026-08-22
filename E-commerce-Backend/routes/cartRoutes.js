/**
 * routes/cartRoutes.js — Cart Routes
 *
 * All routes are private (require JWT).
 *
 * GET    /api/cart           — Get user's cart
 * POST   /api/cart           — Add item to cart
 * DELETE /api/cart/:itemId   — Remove specific item from cart
 * DELETE /api/cart           — Clear entire cart
 */

const express = require('express');
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router.get('/', getCart);
router.post('/', addToCart);
router.delete('/:itemId', removeFromCart);  // Remove specific item
router.delete('/', clearCart);              // Clear all items

module.exports = router;
