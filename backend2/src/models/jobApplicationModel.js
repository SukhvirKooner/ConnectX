const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job ID is required']
  },
  applicant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Applicant ID is required']
  },
  cover_letter: {
    type: String,
    trim: true
  },
  portfolio_url: {
    type: String,
    trim: true
  },
  resume_url: {
    type: String,
    trim: true
  },
  experience: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Ensure a user can only apply once to a job
jobApplicationSchema.index({ job_id: 1, applicant_id: 1 }, { unique: true });

// Add indexes for faster queries
jobApplicationSchema.index({ job_id: 1, status: 1 });
jobApplicationSchema.index({ applicant_id: 1, createdAt: -1 });

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

module.exports = JobApplication;