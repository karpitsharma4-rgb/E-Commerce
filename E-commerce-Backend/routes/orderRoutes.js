/**
 * routes/orderRoutes.js — Order Routes
 *
 * Customer routes (authenticated):
 *   POST   /api/orders          — Create order
 *   GET    /api/orders/my       — Get logged-in user's orders
 *   GET    /api/orders/:id      — Get single order by ID
 *
 * Admin routes:
 *   GET    /api/orders          — Get all orders (with pagination)
 *   PUT    /api/orders/:id/status — Update order status
 */

const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// All order routes require authentication
router.use(protect);

// Customer routes
router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);

// Admin-only routes
router.get('/', adminOnly, getAllOrders);
router.put('/:id/status', adminOnly, updateOrderStatus);

module.exports = router;
