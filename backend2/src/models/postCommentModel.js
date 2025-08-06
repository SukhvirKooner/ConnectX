const mongoose = require('mongoose');

const postCommentSchema = new mongoose.Schema({
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Post ID is required']
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true
  }
}, {
  timestamps: true
});

// Add index for faster queries
postCommentSchema.index({ post_id: 1, createdAt: -1 });

const PostComment = mongoose.model('PostComment', postCommentSchema);

module.exports = PostComment;