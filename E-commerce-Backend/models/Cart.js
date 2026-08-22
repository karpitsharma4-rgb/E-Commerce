/**
 * models/Cart.js — Shopping Cart Schema
 *
 * Server-side cart stored per user.
 * Each cart contains an array of items with product references,
 * selected size/color, and quantity.
 * Total price is derived from items and stored for quick retrieval.
 */

const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },    // Snapshot of product name
  image: { type: String },                   // Snapshot of product image URL
  price: { type: Number, required: true },   // Price at time of adding
  size: { type: String },
  color: { type: String },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One cart per user
    },

    items: [cartItemSchema],

    // Running total updated whenever cart is modified
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Pre-save Hook: Recalculate total price ─────────────────────────────────
cartSchema.pre('save', function (next) {
  this.totalPrice = this.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
