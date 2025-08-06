const express = require('express');
const {
  searchUsers,
  searchPosts,
  searchJobs,
  getTrending
} = require('../controllers/searchController');
const { protect } = require('../middlewares/authMiddleware');
const { validate, searchSchema, paginationSchema } = require('../middlewares/validationMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// Search routes
router.get('/users', validate(searchSchema.users), searchUsers);
router.get('/posts', validate(searchSchema.posts), searchPosts);
router.get('/jobs', validate(searchSchema.jobs), searchJobs);
router.get('/trending', getTrending);

module.exports = router;