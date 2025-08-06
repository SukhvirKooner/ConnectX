const Notification = require('../models/notificationModel');
const { asyncHandler } = require('../middlewares/errorMiddleware');
const { successResponse, errorResponse, notFoundResponse, forbiddenResponse } = require('../utils/responseUtils');
const { paginate } = require('../utils/paginationUtils');

/**
 * @desc    Get user notifications
 * @route   GET /api/notifications
 * @access  Private
 */
const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10, is_read } = req.query;

  // Build query
  const query = { recipient_id: userId };
  if (is_read !== undefined) {
    query.is_read = is_read === 'true';
  }

  // Get paginated results
  const options = {
    populate: [
      { path: 'sender_id', select: 'name avatar_url' }
    ],
    sort: { createdAt: -1 }
  };

  const results = await paginate(Notification, query, page, limit, options);

  // Get unread count
  const unreadCount = await Notification.countDocuments({
    recipient_id: userId,
    is_read: false
  });

  return successResponse(res, 200, 'Notifications retrieved successfully', {
    ...results,
    unreadCount
  });
});

/**
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
const markNotificationRead = asyncHandler(async (req, res) => {
  const notificationId = req.params.id;
  const userId = req.user._id;

  // Find notification by ID
  const notification = await Notification.findById(notificationId);

  if (!notification) {
    return notFoundResponse(res, 'Notification not found');
  }

  // Check if user is the recipient
  if (notification.recipient_id.toString() !== userId.toString()) {
    return forbiddenResponse(res, 'Not authorized to update this notification');
  }

  // Mark as read
  notification.is_read = true;
  await notification.save();

  return successResponse(res, 200, 'Notification marked as read', notification);
});

/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
const markAllNotificationsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Update all unread notifications for the user
  const result = await Notification.updateMany(
    { recipient_id: userId, is_read: false },
    { is_read: true }
  );

  return successResponse(res, 200, 'All notifications marked as read', {
    modifiedCount: result.modifiedCount
  });
});

/**
 * @desc    Delete a notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
const deleteNotification = asyncHandler(async (req, res) => {
  const notificationId = req.params.id;
  const userId = req.user._id;

  // Find notification by ID
  const notification = await Notification.findById(notificationId);

  if (!notification) {
    return notFoundResponse(res, 'Notification not found');
  }

  // Check if user is the recipient
  if (notification.recipient_id.toString() !== userId.toString()) {
    return forbiddenResponse(res, 'Not authorized to delete this notification');
  }

  // Delete notification
  await notification.remove();

  return successResponse(res, 200, 'Notification deleted successfully');
});

module.exports = {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification
};