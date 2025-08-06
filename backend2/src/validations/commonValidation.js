const Joi = require('joi');

// MongoDB ObjectId validation pattern
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

// Schema for MongoDB ObjectId validation
const objectIdSchema = Joi.string().pattern(objectIdPattern).messages({
  'string.pattern.base': 'Invalid ID format. Must be a valid MongoDB ObjectId',
  'string.empty': 'ID cannot be empty'
});

// Schema for pagination parameters
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),
  
  limit: Joi.number().integer().min(1).max(100).default(10)
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    })
});

// Schema for date range parameters
const dateRangeSchema = Joi.object({
  start_date: Joi.date().iso()
    .messages({
      'date.base': 'Start date must be a valid date',
      'date.format': 'Start date must be in ISO format (YYYY-MM-DD)'
    }),
  
  end_date: Joi.date().iso().min(Joi.ref('start_date'))
    .messages({
      'date.base': 'End date must be a valid date',
      'date.format': 'End date must be in ISO format (YYYY-MM-DD)',
      'date.min': 'End date must be after or equal to start date'
    })
});

module.exports = {
  objectIdSchema,
  paginationSchema,
  dateRangeSchema
};