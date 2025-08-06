const express = require('express');
const { getUserProfile, updateUserProfile, completeProfile, searchUsers, uploadAvatar } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { validate, userSchema, paginationSchema } = require('../middlewares/validationMiddleware');
const { uploadAvatar: uploadAvatarMiddleware } = require('../middlewares/uploadMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// User profile routes
router.get('/search', validate(paginationSchema), searchUsers);
router.post('/complete-profile', completeProfile);
router.post('/upload-avatar', uploadAvatarMiddleware, uploadAvatar);

// User profile by ID routes
router.get('/:id', getUserProfile);
router.put('/:id', validate(userSchema.update), updateUserProfile);

module.exports = router;