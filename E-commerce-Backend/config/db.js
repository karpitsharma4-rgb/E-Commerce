/**
 * config/db.js — MongoDB Connection
 *
 * Uses Mongoose to establish a connection to MongoDB.
 * The MONGO_URI is loaded from environment variables.
 * Exits the process if connection fails (fail-fast approach).
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit process with failure code — container orchestrators will restart
    process.exit(1);
  }
};

module.exports = connectDB;
