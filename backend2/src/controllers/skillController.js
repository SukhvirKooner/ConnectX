const Skill = require('../models/skillModel');
const UserSkill = require('../models/userSkillModel');
const SkillEndorsement = require('../models/skillEndorsementModel');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');
const { asyncHandler } = require('../middlewares/errorMiddleware');
const { successResponse, errorResponse, notFoundResponse, forbiddenResponse } = require('../utils/responseUtils');
const { paginate } = require('../utils/paginationUtils');

/**
 * @desc    Get all skills
 * @route   GET /api/skills
 * @access  Private
 */
const getAllSkills = asyncHandler(async (req, res) => {
  const { category, search, page = 1, limit = 20 } = req.query;

  // Build query
  const query = {};
  if (category) query.category = category;
  if (search) query.name = { $regex: search, $options: 'i' };

  // Get paginated results
  const options = {
    sort: { name: 1 }
  };

  const results = await paginate(Skill, query, page, limit, options);

  // Format response with items property
  const response = {
    items: results.data,
    pagination: results.pagination
  };

  return successResponse(res, 200, 'Skills retrieved successfully', response);
});

/**
 * @desc    Get skill by ID
 * @route   GET /api/skills/:id
 * @access  Private
 */
const getSkillById = asyncHandler(async (req, res) => {
  const skillId = req.params.id;

  // Find skill by ID
  const skill = await Skill.findById(skillId);

  if (!skill) {
    return notFoundResponse(res, 'Skill not found');
  }

  return successResponse(res, 200, 'Skill retrieved successfully', skill);
});

/**
 * @desc    Add a skill to user profile
 * @route   POST /api/skills/user
 * @access  Private
 */
const addUserSkill = asyncHandler(async (req, res) => {
  const { skill_id } = req.body;
  const userId = req.user._id;

  // Check if skill exists
  const skill = await Skill.findById(skill_id);
  if (!skill) {
    return notFoundResponse(res, 'Skill not found');
  }

  // Check if user already has this skill
  const existingUserSkill = await UserSkill.findOne({
    user_id: userId,
    skill_id
  });

  if (existingUserSkill) {
    return errorResponse(res, 400, 'Skill already added to your profile');
  }

  // Add skill to user profile
  const userSkill = await UserSkill.create({
    user_id: userId,
    skill_id,
    endorsements_count: 0
  });

  // Populate skill details
  await userSkill.populate('skill_id');

  return successResponse(res, 201, 'Skill added to your profile', userSkill);
});

/**
 * @desc    Remove a skill from user profile
 * @route   DELETE /api/skills/user/:id
 * @access  Private
 */
const removeUserSkill = asyncHandler(async (req, res) => {
  const userSkillId = req.params.id;
  const userId = req.user._id;

  // Find user skill by ID
  const userSkill = await UserSkill.findById(userSkillId);

  if (!userSkill) {
    return notFoundResponse(res, 'User skill not found');
  }

  // Check if user is the owner of the skill
  if (userSkill.user_id.toString() !== userId.toString()) {
    return forbiddenResponse(res, 'Not authorized to remove this skill');
  }

  // Remove skill from user profile
  await UserSkill.deleteOne({ _id: userSkillId });

  // Remove all endorsements for this user skill
  await SkillEndorsement.deleteMany({ user_skill_id: userSkillId });

  return successResponse(res, 200, 'Skill removed from your profile');
});

/**
 * @desc    Get user skills
 * @route   GET /api/skills/user/:userId
 * @access  Private
 */
const getUserSkills = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const { page = 1, limit = 10 } = req.query;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return notFoundResponse(res, 'User not found');
  }

  // Get paginated results
  const options = {
    populate: [
      { path: 'skill_id', select: 'name category' }
    ],
    sort: { endorsements_count: -1 }
  };

  const results = await paginate(UserSkill, { user_id: userId }, page, limit, options);

  // Format response with items property
  const response = {
    items: results.data,
    pagination: results.pagination
  };

  return successResponse(res, 200, 'User skills retrieved successfully', response);
});

/**
 * @desc    Endorse a user skill
 * @route   POST /api/skills/endorse/:userSkillId
 * @access  Private
 */
const endorseSkill = asyncHandler(async (req, res) => {
  const userSkillId = req.params.userSkillId;
  const endorserId = req.user._id;

  // Find user skill by ID
  const userSkill = await UserSkill.findById(userSkillId).populate('skill_id user_id');

  if (!userSkill) {
    return notFoundResponse(res, 'User skill not found');
  }

  // Check if user is trying to endorse their own skill
  if (userSkill.user_id._id.toString() === endorserId.toString()) {
    return errorResponse(res, 400, 'Cannot endorse your own skill');
  }

  // Check if user has already endorsed this skill
  const existingEndorsement = await SkillEndorsement.findOne({
    user_skill_id: userSkillId,
    endorser_id: endorserId
  });

  if (existingEndorsement) {
    return errorResponse(res, 400, 'You have already endorsed this skill');
  }

  // Create endorsement
  const endorsement = await SkillEndorsement.create({
    user_skill_id: userSkillId,
    endorser_id: endorserId
  });

  // Update endorsements count
  userSkill.endorsements_count += 1;
  await userSkill.save();

  // Create notification for the skill owner
  await Notification.create({
    recipient_id: userSkill.user_id._id,
    sender_id: endorserId,
    type: 'skill_endorsement',
    content: `${req.user.name} endorsed your ${userSkill.skill_id.name} skill`,
    reference_id: endorsement._id,
    reference_model: 'SkillEndorsement'
  });

  return successResponse(res, 201, 'Skill endorsed successfully', {
    endorsement,
    endorsements_count: userSkill.endorsements_count
  });
});

/**
 * @desc    Get skill endorsements
 * @route   GET /api/skills/endorsements/:userSkillId
 * @access  Private
 */
const getSkillEndorsements = asyncHandler(async (req, res) => {
  const userSkillId = req.params.userSkillId;
  const { page = 1, limit = 10 } = req.query;

  // Find user skill by ID
  const userSkill = await UserSkill.findById(userSkillId);

  if (!userSkill) {
    return notFoundResponse(res, 'User skill not found');
  }

  // Get paginated results
  const options = {
    populate: [
      { path: 'endorser_id', select: 'name avatar_url title' }
    ],
    sort: { createdAt: -1 }
  };

  const results = await paginate(SkillEndorsement, { user_skill_id: userSkillId }, page, limit, options);

  // Format response with items property
  const response = {
    items: results.data,
    pagination: results.pagination
  };

  return successResponse(res, 200, 'Skill endorsements retrieved successfully', response);
});

module.exports = {
  getAllSkills,
  getSkillById,
  addUserSkill,
  removeUserSkill,
  getUserSkills,
  endorseSkill,
  getSkillEndorsements
};