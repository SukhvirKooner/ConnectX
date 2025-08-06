const mongoose = require('mongoose');

const savedJobSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job ID is required']
  }
}, {
  timestamps: true
});

// Ensure a user can only save a job once
savedJobSchema.index({ user_id: 1, job_id: 1 }, { unique: true });

// Add index for faster queries
savedJobSchema.index({ user_id: 1, createdAt: -1 });

const SavedJob = mongoose.model('SavedJob', savedJobSchema);

module.exports = SavedJob;