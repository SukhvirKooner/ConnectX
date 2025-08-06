const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    trim: true
  },
  image_url: {
    type: String,
    default: ''
  },
  likes_count: {
    type: Number,
    default: 0
  },
  comments_count: {
    type: Number,
    default: 0
  },
  shares_count: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Add index for faster queries
postSchema.index({ user_id: 1, createdAt: -1 });

// Virtual for getting likes
postSchema.virtual('likes', {
  ref: 'PostLike',
  localField: '_id',
  foreignField: 'post_id'
});

// Virtual for getting comments
postSchema.virtual('comments', {
  ref: 'PostComment',
  localField: '_id',
  foreignField: 'post_id'
});

// Set toJSON option to include virtuals
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;