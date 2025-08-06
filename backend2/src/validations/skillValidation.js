const Joi = require('joi');
const { objectIdSchema } = require('./commonValidation');

// Schema for creating/updating a skill
const skillSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required()
    .messages({
      'string.empty': 'Skill name is required',
      'string.min': 'Skill name must be at least {#limit} characters',
      'string.max': 'Skill name cannot exceed {#limit} characters',
      'any.required': 'Skill name is required'
    }),
  
  category: Joi.string().trim().min(2).max(50).required()
    .messages({
      'string.empty': 'Skill category is required',
      'string.min': 'Skill category must be at least {#limit} characters',
      'string.max': 'Skill category cannot exceed {#limit} characters',
      'any.required': 'Skill category is required'
    })
});

// Schema for adding a skill to user profile
const userSkillSchema = Joi.object({
  skill_id: objectIdSchema.required()
    .messages({
      'any.required': 'Skill ID is required',
      'string.pattern.name': 'Invalid skill ID format'
    })
});

module.exports = {
  skillSchema,
  userSkillSchema
};