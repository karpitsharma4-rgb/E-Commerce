/**
 * controllers/orderController.js — Order Management Logic
 *
 * Customer: createOrder, getMyOrders, getOrderById
 * Admin:    getAllOrders, updateOrderStatus
 *
 * On order creation:
 *  - Validates items are in stock
 *  - Calculates pricing (items + tax + shipping)
 *  - Decrements product stock (countInStock)
 *  - Clears user's cart
 */

const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// ─── Helper: Calculate pricing breakdown ────────────────────────────────────
const calcPrices = (items) => {
  const itemsPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const taxPrice = parseFloat((itemsPrice * 0.18).toFixed(2)); // 18% GST
  const shippingPrice = itemsPrice > 999 ? 0 : 99; // Free shipping above ₹999
  const totalPrice = parseFloat(
    (itemsPrice + taxPrice + shippingPrice).toFixed(2)
  );
  return { itemsPrice, taxPrice, shippingPrice, totalPrice };
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, notes } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided.',
      });
    }

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address and payment method are required.',
      });
    }

    // Validate stock and build order items with current prices
    const validatedItems = [];
    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product || !product.isActive) {
        return res.status(404).json({
          success: false,
          message: `Product "${item.name}" is no longer available.`,
        });
      }

      if (product.countInStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.countInStock}`,
        });
      }

      validatedItems.push({
        name: product.name,
        quantity: item.quantity,
        image: product.images?.[0]?.url || '',
        price: product.discountPrice > 0 ? product.discountPrice : product.price,
        size: item.size,
        color: item.color,
        product: product._id,
      });
    }

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(validatedItems);

    // Create the order document
    const order = await Order.create({
      user: req.user._id,
      orderItems: validatedItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      notes,
    });

    // Decrement stock for each ordered product
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { countInStock: -item.quantity },
      });
    }

    // Clear the user's cart after successful order
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], totalPrice: 0 }
    );

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all orders of the logged-in user
// @route   GET /api/orders/my
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get a specific order by ID (user can only see their own)
// @route   GET /api/orders/:id
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    // Ensure regular users can only access their own orders
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all orders (admin — with pagination)
// @route   GET /api/orders
// @access  Private / Admin
// ─────────────────────────────────────────────────────────────────────────────
const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [orders, totalOrders] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(filter),
    ]);

    // Aggregate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    return res.status(200).json({
      success: true,
      totalRevenue,
      data: orders,
      pagination: {
        totalOrders,
        totalPages: Math.ceil(totalOrders / limitNum),
        currentPage: pageNum,
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private / Admin
// ─────────────────────────────────────────────────────────────────────────────
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber } = req.body;

    const validStatuses = [
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded',
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    // Set delivered date when marking as delivered
    const updates = { status };
    if (status === 'delivered') {
      updates.isDelivered = true;
      updates.deliveredAt = Date.now();
    }
    if (trackingNumber) updates.trackingNumber = trackingNumber;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: `Order status updated to "${status}".`,
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
