const mongoose = require('mongoose');

const userSkillSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  skill_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: [true, 'Skill ID is required']
  },
  endorsements_count: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Ensure a user can only have a skill once
userSkillSchema.index({ user_id: 1, skill_id: 1 }, { unique: true });

// Add index for faster queries
userSkillSchema.index({ user_id: 1, endorsements_count: -1 });

// Virtual for getting endorsements
userSkillSchema.virtual('endorsements', {
  ref: 'SkillEndorsement',
  localField: '_id',
  foreignField: 'user_skill_id'
});

// Set toJSON option to include virtuals
userSkillSchema.set('toJSON', { virtuals: true });
userSkillSchema.set('toObject', { virtuals: true });

const UserSkill = mongoose.model('UserSkill', userSkillSchema);

module.exports = UserSkill;