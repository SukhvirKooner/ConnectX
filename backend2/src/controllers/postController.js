const Post = require('../models/postModel');
const PostLike = require('../models/postLikeModel');
const PostComment = require('../models/postCommentModel');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');
const { asyncHandler } = require('../middlewares/errorMiddleware');
const { successResponse, errorResponse, notFoundResponse, forbiddenResponse } = require('../utils/responseUtils');
const { paginate } = require('../utils/paginationUtils');
const { processUploadedFile } = require('../utils/fileUtils');

/**
 * @desc    Get paginated posts feed
 * @route   GET /api/posts
 * @access  Private
 */
const getPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  // Get paginated results
  const options = {
    sort: { createdAt: -1 },
    populate: [
      { path: 'user_id', select: 'name avatar_url title' }
    ]
  };

  const results = await paginate(Post, {}, page, limit, options);

  return successResponse(res, 200, 'Posts retrieved successfully', results);
});

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Private
 */
const createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const userId = req.user._id;

  // Process image if uploaded
  let imageUrl = '';
  if (req.file) {
    const fileInfo = processUploadedFile(req.file);
    imageUrl = fileInfo.url;
  }

  // Create post
  const post = await Post.create({
    user_id: userId,
    content,
    image_url: imageUrl
  });

  // Populate user details
  await post.populate('user_id', 'name avatar_url title');

  return successResponse(res, 201, 'Post created successfully', post);
});

/**
 * @desc    Get a single post by ID
 * @route   GET /api/posts/:id
 * @access  Private
 */
const getPostById = asyncHandler(async (req, res) => {
  const postId = req.params.id;

  // Find post by ID
  const post = await Post.findById(postId).populate('user_id', 'name avatar_url title');

  if (!post) {
    return notFoundResponse(res, 'Post not found');
  }

  // Check if current user has liked the post
  const isLiked = await PostLike.exists({
    post_id: postId,
    user_id: req.user._id
  });

  return successResponse(res, 200, 'Post retrieved successfully', {
    ...post.toObject(),
    isLiked: !!isLiked
  });
});

/**
 * @desc    Update a post
 * @route   PUT /api/posts/:id
 * @access  Private
 */
const updatePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const { content } = req.body;

  // Find post by ID
  const post = await Post.findById(postId);

  if (!post) {
    return notFoundResponse(res, 'Post not found');
  }

  // Check if user is the author of the post
  if (post.user_id.toString() !== req.user._id.toString()) {
    return forbiddenResponse(res, 'Not authorized to update this post');
  }

  // Update post
  post.content = content;

  // Process new image if uploaded
  if (req.file) {
    const fileInfo = processUploadedFile(req.file);
    post.image_url = fileInfo.url;
  }

  // Save updated post
  const updatedPost = await post.save();
  await updatedPost.populate('user_id', 'name avatar_url title');

  return successResponse(res, 200, 'Post updated successfully', updatedPost);
});

/**
 * @desc    Delete a post
 * @route   DELETE /api/posts/:id
 * @access  Private
 */
const deletePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;

  // Find post by ID
  const post = await Post.findById(postId);

  if (!post) {
    return notFoundResponse(res, 'Post not found');
  }

  // Check if user is the author of the post
  if (post.user_id.toString() !== req.user._id.toString()) {
    return forbiddenResponse(res, 'Not authorized to delete this post');
  }

  // Delete post
  await post.remove();

  // Delete associated likes and comments
  await PostLike.deleteMany({ post_id: postId });
  await PostComment.deleteMany({ post_id: postId });

  return successResponse(res, 200, 'Post deleted successfully');
});

/**
 * @desc    Like/unlike a post
 * @route   POST /api/posts/:id/like
 * @access  Private
 */
const toggleLike = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;

  // Find post by ID
  const post = await Post.findById(postId);

  if (!post) {
    return notFoundResponse(res, 'Post not found');
  }

  // Check if user has already liked the post
  const existingLike = await PostLike.findOne({
    post_id: postId,
    user_id: userId
  });

  let isLiked = false;

  if (existingLike) {
    // Unlike the post
    await existingLike.remove();
    post.likes_count = Math.max(0, post.likes_count - 1);
  } else {
    // Like the post
    await PostLike.create({
      post_id: postId,
      user_id: userId
    });
    post.likes_count += 1;
    isLiked = true;

    // Create notification if the post author is not the current user
    if (post.user_id.toString() !== userId.toString()) {
      await Notification.create({
        recipient_id: post.user_id,
        sender_id: userId,
        type: 'post_like',
        content: `${req.user.name} liked your post`,
        reference_id: postId,
        reference_model: 'Post'
      });
    }
  }

  // Save updated post
  await post.save();

  return successResponse(res, 200, isLiked ? 'Post liked' : 'Post unliked', {
    isLiked,
    likesCount: post.likes_count
  });
});

/**
 * @desc    Get users who liked a post
 * @route   GET /api/posts/:id/likes
 * @access  Private
 */
const getPostLikes = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const { page = 1, limit = 10 } = req.query;

  // Find post by ID
  const post = await Post.findById(postId);

  if (!post) {
    return notFoundResponse(res, 'Post not found');
  }

  // Get paginated likes with user details
  const options = {
    populate: [
      { path: 'user_id', select: 'name avatar_url title' }
    ],
    sort: { createdAt: -1 }
  };

  const results = await paginate(PostLike, { post_id: postId }, page, limit, options);

  return successResponse(res, 200, 'Post likes retrieved successfully', results);
});

/**
 * @desc    Add a comment to a post
 * @route   POST /api/posts/:id/comments
 * @access  Private
 */
const addComment = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const { content } = req.body;
  const userId = req.user._id;

  // Find post by ID
  const post = await Post.findById(postId);

  if (!post) {
    return notFoundResponse(res, 'Post not found');
  }

  // Create comment
  const comment = await PostComment.create({
    post_id: postId,
    user_id: userId,
    content
  });

  // Populate user details
  await comment.populate('user_id', 'name avatar_url title');

  // Update post comments count
  post.comments_count += 1;
  await post.save();

  // Create notification if the post author is not the current user
  if (post.user_id.toString() !== userId.toString()) {
    await Notification.create({
      recipient_id: post.user_id,
      sender_id: userId,
      type: 'post_comment',
      content: `${req.user.name} commented on your post`,
      reference_id: postId,
      reference_model: 'Post'
    });
  }

  return successResponse(res, 201, 'Comment added successfully', comment);
});

/**
 * @desc    Get comments for a post
 * @route   GET /api/posts/:id/comments
 * @access  Private
 */
const getPostComments = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const { page = 1, limit = 10 } = req.query;

  // Find post by ID
  const post = await Post.findById(postId);

  if (!post) {
    return notFoundResponse(res, 'Post not found');
  }

  // Get paginated comments with user details
  const options = {
    populate: [
      { path: 'user_id', select: 'name avatar_url title' }
    ],
    sort: { createdAt: -1 }
  };

  const results = await paginate(PostComment, { post_id: postId }, page, limit, options);

  return successResponse(res, 200, 'Post comments retrieved successfully', results);
});

/**
 * @desc    Share a post
 * @route   POST /api/posts/:id/share
 * @access  Private
 */
const sharePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const { content } = req.body;
  const userId = req.user._id;

  // Find original post by ID
  const originalPost = await Post.findById(postId).populate('user_id', 'name');

  if (!originalPost) {
    return notFoundResponse(res, 'Post not found');
  }

  // Create new post as a share
  const sharedContent = content || `Shared a post from ${originalPost.user_id.name}`;
  
  const sharedPost = await Post.create({
    user_id: userId,
    content: sharedContent,
    image_url: originalPost.image_url,
    original_post_id: postId
  });

  // Update original post shares count
  originalPost.shares_count += 1;
  await originalPost.save();

  // Populate user details
  await sharedPost.populate('user_id', 'name avatar_url title');

  // Create notification if the original post author is not the current user
  if (originalPost.user_id._id.toString() !== userId.toString()) {
    await Notification.create({
      recipient_id: originalPost.user_id._id,
      sender_id: userId,
      type: 'post_share',
      content: `${req.user.name} shared your post`,
      reference_id: postId,
      reference_model: 'Post'
    });
  }

  return successResponse(res, 201, 'Post shared successfully', sharedPost);
});

module.exports = {
  getPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  getPostLikes,
  addComment,
  getPostComments,
  sharePost
};