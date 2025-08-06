const { z } = require('zod');
const { validationErrorResponse } = require('../utils/responseUtils');

/**
 * Middleware to validate request data using Zod schemas
 * @param {Object} schema - Zod schema for validation
 * @param {String} source - Request property to validate ('body', 'query', 'params')
 */
const validate = (schema, source = 'body') => (req, res, next) => {
  try {
    const data = schema.parse(req[source]);
    req[source] = data; // Replace with validated data
    next();
  } catch (error) {
    if (error.errors) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      });
    }
    next(error);
  }
};

/**
 * Middleware to validate request data using Joi schemas
 * @param {Object} schema - Joi schema for validation
 * @param {String} source - Request property to validate ('body', 'query', 'params')
 */
const validationMiddleware = (schema, source = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[source], { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return validationErrorResponse(res, errors);
  }
  
  req[source] = value; // Replace with validated data
  next();
};

// Common validation schemas
const schemas = {
  // Auth schemas
  register: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    title: z.string().optional(),
    company: z.string().optional(),
    location: z.string().optional(),
  }),

  login: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),

  refresh: z.object({
    refresh_token: z.string().min(1, 'Refresh token is required'),
  }),

  // User schemas
  updateUser: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    title: z.string().optional(),
    company: z.string().optional(),
    location: z.string().optional(),
    bio: z.string().optional(),
  }),

  // Post schemas
  createPost: z.object({
    content: z.string().min(1, 'Post content is required'),
    image_url: z.string().optional(),
  }),

  updatePost: z.object({
    content: z.string().min(1, 'Post content is required').optional(),
    image_url: z.string().optional(),
  }),

  // Comment schemas
  createComment: z.object({
    content: z.string().min(1, 'Comment content is required'),
  }),

  // Connection schemas
  createConnection: z.object({
    addressee_id: z.string().min(1, 'Addressee ID is required'),
    message: z.string().optional(),
  }),

  // Job schemas
  createJob: z.object({
    title: z.string().min(1, 'Job title is required'),
    company: z.string().min(1, 'Company name is required'),
    location: z.string().min(1, 'Job location is required'),
    job_type: z.enum(['full-time', 'part-time', 'contract', 'internship', 'remote']),
    salary_range: z.string().optional(),
    description: z.string().min(1, 'Job description is required'),
    requirements: z.string().min(1, 'Job requirements are required'),
    status: z.enum(['active', 'closed', 'draft']).default('active'),
  }),

  // Job application schemas
  createJobApplication: z.object({
    cover_letter: z.string().optional(),
    portfolio_url: z.string().url('Invalid portfolio URL').optional(),
    experience: z.string().optional(),
  }),

  // Skill schemas
  addSkill: z.object({
    name: z.string().min(1, 'Skill name is required'),
  }),

  // Search schemas
  searchUsers: z.object({
    q: z.string().optional(),
    location: z.string().optional(),
    industry: z.string().optional(),
    page: z.string().optional().transform(val => parseInt(val) || 1),
    limit: z.string().optional().transform(val => parseInt(val) || 10),
  }),

  searchPosts: z.object({
    q: z.string().optional(),
    hashtags: z.string().optional(),
    page: z.string().optional().transform(val => parseInt(val) || 1),
    limit: z.string().optional().transform(val => parseInt(val) || 10),
  }),

  searchJobs: z.object({
    q: z.string().optional(),
    location: z.string().optional(),
    job_type: z.string().optional(),
    salary_min: z.string().optional().transform(val => parseInt(val) || 0),
    salary_max: z.string().optional().transform(val => parseInt(val) || 0),
    page: z.string().optional().transform(val => parseInt(val) || 1),
    limit: z.string().optional().transform(val => parseInt(val) || 10),
  }),

  // Pagination schema
  pagination: z.object({
    page: z.string().optional().transform(val => parseInt(val) || 1),
    limit: z.string().optional().transform(val => parseInt(val) || 10),
  }),
};

module.exports = { validate, validationMiddleware, schemas };

// Export schema objects for convenience
module.exports.authSchema = {
  register: schemas.register,
  login: schemas.login,
  refresh: schemas.refresh
};
module.exports.userSchema = schemas.updateUser;
module.exports.postSchema = {
  create: schemas.createPost,
  update: schemas.updatePost
};
module.exports.commentSchema = schemas.createComment;
module.exports.connectionSchema = schemas.createConnection;
module.exports.jobSchema = schemas.createJob;
module.exports.jobApplicationSchema = schemas.createJobApplication;
module.exports.searchSchema = {
  users: schemas.searchUsers,
  posts: schemas.searchPosts,
  jobs: schemas.searchJobs
};
module.exports.paginationSchema = schemas.pagination;