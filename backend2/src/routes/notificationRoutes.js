const express = require('express');
const {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification
} = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');
const { validate, paginationSchema } = require('../middlewares/validationMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// Notification routes
router.get('/', validate(paginationSchema), getNotifications);
router.put('/read-all', markAllNotificationsRead);

// Notification by ID routes
router.put('/:id/read', markNotificationRead);
router.delete('/:id', deleteNotification);

module.exports = router;