const express = require('express');
const router = express.Router();
const { 
  getAllSkills, 
  getSkillById, 
  addUserSkill, 
  removeUserSkill, 
  getUserSkills, 
  endorseSkill, 
  getSkillEndorsements 
} = require('../controllers/skillController');
const { protect } = require('../middlewares/authMiddleware');
const { validationMiddleware } = require('../middlewares/validationMiddleware');
const { skillSchema, userSkillSchema } = require('../validations/skillValidation');

// Protect all routes
router.use(protect);

// Get all skills
router.get('/', getAllSkills);

// Get skill by ID
router.get('/:id', getSkillById);

// Add skill to user profile
router.post('/user', validationMiddleware(userSkillSchema), addUserSkill);

// Remove skill from user profile
router.delete('/user/:id', removeUserSkill);

// Get user skills
router.get('/user/:userId', getUserSkills);

// Endorse a user skill
router.post('/endorse/:userSkillId', endorseSkill);

// Get skill endorsements
router.get('/endorsements/:userSkillId', getSkillEndorsements);

module.exports = router;