/**
 * models/Order.js — Order Schema
 *
 * Represents a completed or pending customer order.
 * Stores a snapshot of ordered items (not references) to preserve
 * historical accuracy even if products are later modified or deleted.
 */

const mongoose = require('mongoose');

// Snapshot of each product at time of purchase
const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String },
  price: { type: Number, required: true },
  size: { type: String },
  color: { type: String },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    orderItems: {
      type: [orderItemSchema],
      validate: {
        validator: (items) => items.length > 0,
        message: 'Order must contain at least one item',
      },
    },

    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true, default: 'India' },
    },

    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: ['COD', 'UPI', 'CreditCard', 'DebitCard', 'NetBanking', 'Wallet'],
    },

    paymentResult: {
      id: { type: String },          // Transaction/payment gateway ID
      status: { type: String },      // Paid, Failed, Pending
      updateTime: { type: String },
      emailAddress: { type: String },
    },

    // Pricing breakdown
    itemsPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },

    // Payment status
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },

    // Order fulfillment status
    status: {
      type: String,
      enum: [
        'pending',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'refunded',
      ],
      default: 'pending',
    },

    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },

    trackingNumber: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Index for user-specific order lookups ───────────────────────────────────
orderSchema.index({ user: 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
