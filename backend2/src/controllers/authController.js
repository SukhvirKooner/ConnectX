const User = require('../models/userModel');
const { asyncHandler } = require('../middlewares/errorMiddleware');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwtUtils');
const { successResponse, errorResponse, unauthorizedResponse } = require('../utils/responseUtils');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { email, password, name, title, company, location } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return errorResponse(res, 400, 'User already exists');
  }

  // Create new user
  const user = await User.create({
    email,
    password_hash: password, // Will be hashed by pre-save hook
    name,
    title,
    company,
    location,
    profile_completed: false
  });

  if (user) {
    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Return user data and tokens
    return successResponse(res, 201, 'User registered successfully', {
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        title: user.title,
        company: user.company,
        location: user.location,
        avatar_url: user.avatar_url,
        profile_completed: user.profile_completed
      },
      accessToken,
      refreshToken
    });
  } else {
    return errorResponse(res, 400, 'Invalid user data');
  }
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  // Check if user exists and password matches
  if (user && (await user.matchPassword(password))) {
    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Return user data and tokens
    return successResponse(res, 200, 'Login successful', {
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        title: user.title,
        company: user.company,
        location: user.location,
        bio: user.bio,
        avatar_url: user.avatar_url,
        profile_completed: user.profile_completed
      },
      accessToken,
      refreshToken
    });
  } else {
    return unauthorizedResponse(res, 'Invalid email or password');
  }
});

/**
 * @desc    Logout user (invalidate refresh token)
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  // In a production app, you would invalidate the refresh token in a token blacklist/database
  // For this implementation, we'll just return a success response
  return successResponse(res, 200, 'Logout successful');
});

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    return unauthorizedResponse(res, 'Refresh token is required');
  }

  try {
    // Verify refresh token
    const decoded = verifyRefreshToken(token);

    // Find user
    const user = await User.findById(decoded.id).select('-password_hash');

    if (!user) {
      return unauthorizedResponse(res, 'User not found');
    }

    // Generate new access token
    const accessToken = generateAccessToken(user);

    return successResponse(res, 200, 'Token refreshed successfully', {
      accessToken
    });
  } catch (error) {
    return unauthorizedResponse(res, 'Invalid refresh token');
  }
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  // req.user is set by the protect middleware
  const user = await User.findById(req.user._id);

  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  return successResponse(res, 200, 'User profile retrieved successfully', {
    _id: user._id,
    email: user.email,
    name: user.name,
    title: user.title,
    company: user.company,
    location: user.location,
    bio: user.bio,
    avatar_url: user.avatar_url,
    profile_completed: user.profile_completed,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  });
});

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  getMe
};