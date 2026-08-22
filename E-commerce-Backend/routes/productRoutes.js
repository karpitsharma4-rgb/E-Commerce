/**
 * routes/productRoutes.js — Product Routes
 *
 * GET    /api/products              — Get all products (public, filters & pagination)
 * GET    /api/products/:id          — Get single product (public)
 * POST   /api/products              — Create product (admin only)
 * PUT    /api/products/:id          — Update product (admin only)
 * DELETE /api/products/:id          — Delete product (soft, admin only)
 */

const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// ─── Validation Rules ────────────────────────────────────────────────────────

const createProductValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['men', 'women', 'kids', 'accessories', 'footwear', 'activewear', 'ethnic', 'western'])
    .withMessage('Invalid category'),

  body('countInStock')
    .notEmpty().withMessage('Stock count is required')
    .isInt({ min: 0 }).withMessage('Stock cannot be negative'),
];

// ─── Route Definitions ───────────────────────────────────────────────────────

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only routes
router.post('/', protect, adminOnly, createProductValidation, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
