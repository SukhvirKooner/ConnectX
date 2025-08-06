const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipient ID is required']
  },
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    required: [true, 'Notification type is required'],
    enum: [
      'connection_request',
      'connection_accepted',
      'post_like',
      'post_comment',
      'post_share',
      'job_application',
      'job_application_status',
      'skill_endorsement',
      'system'
    ]
  },
  content: {
    type: String,
    required: [true, 'Notification content is required']
  },
  reference_id: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'reference_model'
  },
  reference_model: {
    type: String,
    enum: ['Post', 'Connection', 'Job', 'JobApplication', 'UserSkill', 'SkillEndorsement', null]
  },
  is_read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add indexes for faster queries
notificationSchema.index({ recipient_id: 1, is_read: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;