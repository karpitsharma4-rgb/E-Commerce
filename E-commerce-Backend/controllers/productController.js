/**
 * controllers/productController.js — Product Management Logic
 *
 * Public:  getProducts, getProductById
 * Admin:   createProduct, updateProduct, deleteProduct
 *
 * getProducts supports:
 *   - Pagination (?page=1&limit=10)
 *   - Category filter (?category=men)
 *   - Price range filter (?minPrice=100&maxPrice=1000)
 *   - Keyword search (?keyword=shirt)
 *   - Sort (?sort=price_asc | price_desc | newest)
 */

const { validationResult } = require('express-validator');
const Product = require('../models/Product');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getProducts = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    // Build the query filter object
    const filter = { isActive: true };

    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { brand: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (category) {
      filter.category = category.toLowerCase();
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Build sort object
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [products, totalProducts] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: products,
      pagination: {
        totalProducts,
        totalPages: Math.ceil(totalProducts / limitNum),
        currentPage: pageNum,
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Create a new product
// @route   POST /api/products
// @access  Private / Admin
// ─────────────────────────────────────────────────────────────────────────────
const createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const product = await Product.create({
      ...req.body,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Private / Admin
// ─────────────────────────────────────────────────────────────────────────────
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Soft-delete a product (marks isActive: false)
// @route   DELETE /api/products/:id
// @access  Private / Admin
// ─────────────────────────────────────────────────────────────────────────────
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // Soft-delete: preserves order history integrity
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
