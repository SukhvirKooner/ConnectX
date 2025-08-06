const jwt = require('jsonwebtoken');

/**
 * Generate JWT token
 * @param {Object} payload - Data to be included in the token
 * @param {String} secret - Secret key for signing the token
 * @param {String} expiresIn - Token expiration time
 * @returns {String} - JWT token
 */
const generateToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Generate access token
 * @param {Object} user - User object
 * @returns {String} - Access token
 */
const generateAccessToken = (user) => {
  return generateToken(
    { id: user._id },
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRE || '30d'
  );
};

/**
 * Generate refresh token
 * @param {Object} user - User object
 * @returns {String} - Refresh token
 */
const generateRefreshToken = (user) => {
  return generateToken(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    process.env.JWT_REFRESH_EXPIRE || '7d'
  );
};

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @param {String} secret - Secret key for verification
 * @returns {Object} - Decoded token payload
 */
const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

/**
 * Verify refresh token
 * @param {String} token - Refresh token to verify
 * @returns {Object} - Decoded token payload
 */
const verifyRefreshToken = (token) => {
  return verifyToken(token, process.env.JWT_REFRESH_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken
};