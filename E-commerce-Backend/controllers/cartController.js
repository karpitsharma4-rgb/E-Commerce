/**
 * controllers/cartController.js — Cart Logic
 *
 * Manages a server-side shopping cart per authenticated user.
 * Supports adding, updating quantity, removing items, and clearing.
 *
 * Cart document is upserted (create if not exists, update if exists).
 */

const Cart = require('../models/Cart');
const Product = require('../models/Product');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get the logged-in user's cart
// @route   GET /api/cart
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name images price countInStock isActive'
    );

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: { items: [], totalPrice: 0 },
      });
    }

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Add an item to the cart (or increase qty if already present)
// @route   POST /api/cart
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required.',
      });
    }

    // Validate product exists and is in stock
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    if (product.countInStock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.countInStock} item(s) available in stock.`,
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // Create a new cart for this user
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if the same product+size+color combo already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItemIndex >= 0) {
      // Increase quantity of existing item
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item with product snapshot
      cart.items.push({
        product: productId,
        name: product.name,
        image: product.images?.[0]?.url || '',
        price: product.discountPrice > 0 ? product.discountPrice : product.price,
        size,
        color,
        quantity,
      });
    }

    await cart.save(); // Pre-save hook recalculates totalPrice

    return res.status(200).json({
      success: true,
      message: 'Item added to cart.',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Remove a specific item from cart by cart item ID
// @route   DELETE /api/cart/:itemId
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found.',
      });
    }

    // Filter out the item with the given subdocument _id
    const originalLength = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item._id.toString() !== req.params.itemId
    );

    if (cart.items.length === originalLength) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found.',
      });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Item removed from cart.',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Clear all items from the cart
// @route   DELETE /api/cart
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], totalPrice: 0 }
    );

    return res.status(200).json({
      success: true,
      message: 'Cart cleared.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, removeFromCart, clearCart };
