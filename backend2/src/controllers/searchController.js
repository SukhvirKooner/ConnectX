const User = require('../models/userModel');
const Post = require('../models/postModel');
const Job = require('../models/jobModel');
const { asyncHandler } = require('../middlewares/errorMiddleware');
const { successResponse } = require('../utils/responseUtils');
const { paginate, aggregatePaginate } = require('../utils/paginationUtils');

/**
 * @desc    Search users
 * @route   GET /api/search/users
 * @access  Private
 */
const searchUsers = asyncHandler(async (req, res) => {
  const { q, location, industry, page = 1, limit = 10 } = req.query;

  // Build search query
  const query = {};
  
  // Text search if query provided
  if (q) {
    query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { title: { $regex: q, $options: 'i' } },
      { company: { $regex: q, $options: 'i' } },
      { bio: { $regex: q, $options: 'i' } }
    ];
  }
  
  // Additional filters
  if (location) query.location = { $regex: location, $options: 'i' };
  if (industry) query.company = { $regex: industry, $options: 'i' };
  
  // Exclude current user
  query._id = { $ne: req.user._id };

  // Get paginated results
  const options = {
    select: 'name avatar_url title company location bio',
    sort: { name: 1 }
  };

  const results = await paginate(User, query, page, limit, options);

  return successResponse(res, 200, 'Users search results', results);
});

/**
 * @desc    Search posts
 * @route   GET /api/search/posts
 * @access  Private
 */
const searchPosts = asyncHandler(async (req, res) => {
  const { q, hashtags, page = 1, limit = 10 } = req.query;

  // Build search query
  const query = {};
  
  // Text search if query provided
  if (q) {
    query.content = { $regex: q, $options: 'i' };
  }
  
  // Hashtag search
  if (hashtags) {
    const hashtagsArray = hashtags.split(',').map(tag => tag.trim());
    const hashtagQueries = hashtagsArray.map(tag => {
      return { content: { $regex: `#${tag}\\b`, $options: 'i' } };
    });
    
    if (hashtagQueries.length > 0) {
      query.$or = hashtagQueries;
    }
  }

  // Get paginated results
  const options = {
    populate: [
      { path: 'user_id', select: 'name avatar_url title' }
    ],
    sort: { createdAt: -1 }
  };

  const results = await paginate(Post, query, page, limit, options);

  return successResponse(res, 200, 'Posts search results', results);
});

/**
 * @desc    Search jobs
 * @route   GET /api/search/jobs
 * @access  Private
 */
const searchJobs = asyncHandler(async (req, res) => {
  const {
    q,
    location,
    job_type,
    salary_min,
    salary_max,
    page = 1,
    limit = 10
  } = req.query;

  // Build search query
  const query = { status: 'active' };
  
  // Text search if query provided
  if (q) {
    query.$or = [
      { title: { $regex: q, $options: 'i' } },
      { company: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { requirements: { $regex: q, $options: 'i' } }
    ];
  }
  
  // Additional filters
  if (location) query.location = { $regex: location, $options: 'i' };
  if (job_type) query.job_type = job_type;
  
  // Salary range filter (requires preprocessing salary_range field)
  if (salary_min || salary_max) {
    // This is a simplified approach. In a real app, you'd need to standardize salary formats
    const salaryRegex = [];
    
    if (salary_min) {
      salaryRegex.push({ salary_range: { $regex: new RegExp(`\\$?${salary_min}|\\$?[${parseInt(salary_min) + 1}-9]\\d*k?`) } });
    }
    
    if (salary_max) {
      salaryRegex.push({ salary_range: { $regex: new RegExp(`\\$?\\d{1,3}k?\\s*-\\s*\\$?${salary_max}k?`) } });
    }
    
    if (salaryRegex.length > 0) {
      query.$and = salaryRegex;
    }
  }

  // Get paginated results
  const options = {
    populate: [
      { path: 'posted_by', select: 'name avatar_url company' }
    ],
    sort: { createdAt: -1 }
  };

  const results = await paginate(Job, query, page, limit, options);

  return successResponse(res, 200, 'Jobs search results', results);
});

/**
 * @desc    Get trending content
 * @route   GET /api/search/trending
 * @access  Private
 */
const getTrending = asyncHandler(async (req, res) => {
  // Get trending posts (most liked and commented in the last week)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const trendingPosts = await Post.find({
    createdAt: { $gte: oneWeekAgo }
  })
    .sort({ likes_count: -1, comments_count: -1 })
    .limit(5)
    .populate('user_id', 'name avatar_url title');
  
  // Get trending jobs (most recently posted)
  const trendingJobs = await Job.find({ status: 'active' })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('posted_by', 'name avatar_url company');
  
  // Get trending hashtags
  // This is a simplified approach. In a real app, you'd need a more sophisticated hashtag extraction
  const hashtagPipeline = [
    {
      $match: {
        createdAt: { $gte: oneWeekAgo },
        content: { $regex: '#\\w+', $options: 'i' }
      }
    },
    {
      $project: {
        hashtags: {
          $regexFindAll: {
            input: '$content',
            regex: '#(\\w+)',
            options: 'i'
          }
        }
      }
    },
    { $unwind: '$hashtags' },
    {
      $group: {
        _id: { $toLower: '$hashtags.captures.0' },
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
    {
      $project: {
        _id: 0,
        hashtag: '$_id',
        count: 1
      }
    }
  ];
  
  const trendingHashtags = await Post.aggregate(hashtagPipeline);
  
  return successResponse(res, 200, 'Trending content retrieved successfully', {
    trendingPosts,
    trendingJobs,
    trendingHashtags
  });
});

module.exports = {
  searchUsers,
  searchPosts,
  searchJobs,
  getTrending
};