/**
 * utils/generateToken.js — JWT Token Utility
 *
 * Generates a signed JWT token for a given user ID.
 * Token expiry is controlled by the JWT_EXPIRES_IN environment variable.
 */

const jwt = require('jsonwebtoken');

/**
 * @param {string} userId - The MongoDB _id of the user
 * @returns {string} Signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );
};

module.exports = generateToken;
