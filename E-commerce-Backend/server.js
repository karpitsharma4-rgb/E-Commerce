/**
 * server.js - Application Entry Point
 *
 * Initializes the Express app, connects to MongoDB,
 * registers all routes, and starts listening on the configured port.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ─── Global Middleware ──────────────────────────────────────────────────────

// Enable CORS for all origins (restrict in production via CORS options)
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// ─── API Routes ─────────────────────────────────────────────────────────────

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// ─── Health Check ────────────────────────────────────────────────────────────

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Clothing E-Commerce API is running 🚀',
    version: '1.0.0',
  });
});

// ─── Error Handling Middleware ───────────────────────────────────────────────

// 404 handler — must come after all valid routes
app.use(notFound);

// Global error handler — catches all thrown errors
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
