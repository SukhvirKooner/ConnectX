const express = require('express');
const { register, login, logout, refreshToken, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { validate, authSchema } = require('../middlewares/validationMiddleware');

const router = express.Router();

// Public routes
router.post('/register', validate(authSchema.register), register);
router.post('/login', validate(authSchema.login), login);
router.post('/refresh', validate(authSchema.refresh), refreshToken);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;