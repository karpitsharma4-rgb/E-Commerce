/**
 * controllers/authController.js — Authentication Logic
 *
 * Handles user registration, login, and profile retrieval.
 * Passwords are hashed by the User model's pre-save hook.
 * JWT tokens are generated via the generateToken utility.
 */

const { validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const registerUser = async (req, res, next) => {
  try {
    // Validate request body (rules defined in routes)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { name, email, password, phone } = req.body;

    // Check if user already exists with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Create user — password hashing happens in the pre-save hook
    const user = await User.create({ name, email, password, phone });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Authenticate user and return JWT
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // password field has select:false — explicitly include it here
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      // Use a generic message to avoid email enumeration attacks
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Contact support.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get logged-in user's profile
// @route   GET /api/auth/me
// @access  Private (requires JWT)
// ─────────────────────────────────────────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    // req.user is already populated (minus password) by the protect middleware
    // No need for an extra DB round-trip
    return res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update logged-in user's profile
// @route   PUT /api/auth/me
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const updateMe = async (req, res, next) => {
  try {
    const { name, email, phone, address, password } = req.body;

    // Fetch the full user document (needed for .save() to trigger hooks)
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Apply allowed field updates
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;

    // Email update: check it's not already taken by another user
    if (email && email !== user.email) {
      const emailTaken = await User.findOne({ email, _id: { $ne: user._id } });
      if (emailTaken) {
        return res.status(409).json({
          success: false,
          message: 'This email is already in use by another account.',
        });
      }
      user.email = email;
    }

    // Password update: use save() so the pre-save bcrypt hook fires
    if (password) {
      if (password.length < 6) {
        return res.status(422).json({
          success: false,
          message: 'Password must be at least 6 characters.',
        });
      }
      user.password = password; // pre-save hook will hash this
    }

    await user.save({ validateBeforeSave: true });

    // Return user without password
    const updatedUser = await User.findById(user._id);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getMe, updateMe };
