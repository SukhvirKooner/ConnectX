const express = require('express');
const {
  getPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  getPostLikes,
  addComment,
  getPostComments,
  sharePost,
  getPostsByUserId
} = require('../controllers/postController');
const { protect, isOwner } = require('../middlewares/authMiddleware');
const { validate, postSchema, commentSchema, paginationSchema } = require('../middlewares/validationMiddleware');
const { uploadPostImage } = require('../middlewares/uploadMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// Post routes
router.get('/', validate(paginationSchema), getPosts);
router.post('/', uploadPostImage, validate(postSchema.create), createPost);

// Post by ID routes
router.get('/:id', getPostById);
router.put('/:id', uploadPostImage, validate(postSchema.update), updatePost);
router.delete('/:id', deletePost);

// Post likes routes
router.post('/:id/like', toggleLike);
router.get('/:id/likes', validate(paginationSchema), getPostLikes);

// Post comments routes
router.post('/:id/comments', validate(commentSchema.create), addComment);
router.get('/:id/comments', validate(paginationSchema), getPostComments);

// Post share route
router.post('/:id/share', validate(postSchema.share), sharePost);

// Get posts by user ID
router.get('/user/:userId', validate(paginationSchema), getPostsByUserId);

module.exports = router;