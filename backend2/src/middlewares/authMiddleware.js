const jwt = require('jsonwebtoken');
const { asyncHandler } = require('./errorMiddleware');
const User = require('../models/userModel');

/**
 * Middleware to protect routes that require authentication
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id).select('-password_hash');

      if (!req.user) {
        res.status(401);
        throw new Error('User not found');
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

/**
 * Middleware to check if the user is the owner of a resource
 * @param {Function} getResourceOwner - Function to get the owner ID of the resource
 */
const isOwner = (getResourceOwner) => asyncHandler(async (req, res, next) => {
  const resourceOwnerId = await getResourceOwner(req);
  
  if (!resourceOwnerId || resourceOwnerId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized, not the owner');
  }
  
  next();
});

module.exports = { protect, isOwner };