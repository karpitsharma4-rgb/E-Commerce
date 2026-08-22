/**
 * models/Product.js — Product Schema
 *
 * Represents a clothing product in the catalog.
 * Supports category filtering, price range queries, and stock tracking.
 * Includes virtuals for average rating computed from embedded reviews.
 */

const mongoose = require('mongoose');

// Sub-schema for individual product reviews
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },

    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },

    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },

    discountPrice: {
      type: Number,
      default: 0,
      min: [0, 'Discount price cannot be negative'],
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'men',
        'women',
        'kids',
        'accessories',
        'footwear',
        'activewear',
        'ethnic',
        'western',
      ],
      lowercase: true,
    },

    brand: {
      type: String,
      trim: true,
    },

    images: [
      {
        url: { type: String, required: true },
        altText: { type: String },
      },
    ],

    // Size options available for this product
    sizes: [
      {
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size'],
      },
    ],

    // Available color variants
    colors: [{ type: String, trim: true }],

    // Inventory stock count
    countInStock: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },

    reviews: [reviewSchema],

    // Aggregate rating fields — updated when reviews are added/removed
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // Who created/last modified this product (admin user ID)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// ─── Index for efficient filtering and search ───────────────────────────────
productSchema.index({ category: 1, price: 1 });
productSchema.index({ name: 'text', description: 'text' }); // Full-text search

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
