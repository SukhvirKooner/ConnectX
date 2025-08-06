const User = require('../models/userModel');
const Connection = require('../models/connectionModel');
const Post = require('../models/postModel');
const { asyncHandler } = require('../middlewares/errorMiddleware');
const { successResponse, errorResponse, notFoundResponse } = require('../utils/responseUtils');
const { processUploadedFile } = require('../utils/fileUtils');
const { paginate } = require('../utils/paginationUtils');

/**
 * @desc    Get user profile by ID
 * @route   GET /api/users/:id
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const currentUserId = req.user._id;

  // Find user by ID
  const user = await User.findById(userId).select('-password_hash');

  if (!user) {
    return notFoundResponse(res, 'User not found');
  }

  // Get connection status between current user and profile user
  let connectionStatus = null;
  if (userId !== currentUserId.toString()) {
    const connection = await Connection.findOne({
      $or: [
        { requester_id: currentUserId, addressee_id: userId },
        { requester_id: userId, addressee_id: currentUserId }
      ]
    });

    if (connection) {
      connectionStatus = connection.status;
    }
  }

  // Get counts
  const connectionsCount = await Connection.countDocuments({
    $or: [
      { requester_id: userId, status: 'accepted' },
      { addressee_id: userId, status: 'accepted' }
    ]
  });

  const postsCount = await Post.countDocuments({ user_id: userId });

  // Return user profile with stats
  return successResponse(res, 200, 'User profile retrieved successfully', {
    ...user.toObject(),
    connectionStatus,
    stats: {
      connectionsCount,
      postsCount
    }
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/:id
 * @access  Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const currentUserId = req.user._id;

  // Check if user is updating their own profile
  if (userId !== currentUserId.toString()) {
    return errorResponse(res, 403, 'Not authorized to update this profile');
  }

  const { name, title, company, location, bio } = req.body;

  // Find user by ID
  const user = await User.findById(userId);

  if (!user) {
    return notFoundResponse(res, 'User not found');
  }

  // Update user fields
  if (name) user.name = name;
  if (title) user.title = title;
  if (company) user.company = company;
  if (location) user.location = location;
  if (bio) user.bio = bio;

  // Save updated user
  const updatedUser = await user.save();

  return successResponse(res, 200, 'Profile updated successfully', {
    _id: updatedUser._id,
    email: updatedUser.email,
    name: updatedUser.name,
    title: updatedUser.title,
    company: updatedUser.company,
    location: updatedUser.location,
    bio: updatedUser.bio,
    avatar_url: updatedUser.avatar_url,
    profile_completed: updatedUser.profile_completed
  });
});

/**
 * @desc    Mark profile as completed
 * @route   POST /api/users/complete-profile
 * @access  Private
 */
const completeProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find user by ID
  const user = await User.findById(userId);

  if (!user) {
    return notFoundResponse(res, 'User not found');
  }

  // Check if required fields are filled
  if (!user.name || !user.title || !user.location) {
    return errorResponse(res, 400, 'Please fill in all required profile fields');
  }

  // Mark profile as completed
  user.profile_completed = true;
  await user.save();

  return successResponse(res, 200, 'Profile marked as completed');
});

/**
 * @desc    Search users
 * @route   GET /api/users/search
 * @access  Private
 */
const searchUsers = asyncHandler(async (req, res) => {
  const { name, title, company, page = 1, limit = 10 } = req.query;

  // Build search query
  const query = {};
  if (name) query.name = { $regex: name, $options: 'i' };
  if (title) query.title = { $regex: title, $options: 'i' };
  if (company) query.company = { $regex: company, $options: 'i' };

  // Exclude current user from results
  query._id = { $ne: req.user._id };

  // Get paginated results
  const options = {
    select: '-password_hash',
    sort: { name: 1 }
  };

  const results = await paginate(User, query, page, limit, options);

  return successResponse(res, 200, 'Users retrieved successfully', results);
});

/**
 * @desc    Upload user avatar
 * @route   POST /api/users/upload-avatar
 * @access  Private
 */
const uploadAvatar = asyncHandler(async (req, res) => {
  // Check if file was uploaded
  if (!req.file) {
    return errorResponse(res, 400, 'Please upload an image file');
  }

  // Process uploaded file
  const fileInfo = processUploadedFile(req.file);

  // Update user's avatar_url
  const user = await User.findById(req.user._id);
  user.avatar_url = fileInfo.url;
  await user.save();

  return successResponse(res, 200, 'Avatar uploaded successfully', {
    avatar_url: fileInfo.url
  });
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  completeProfile,
  searchUsers,
  uploadAvatar
};