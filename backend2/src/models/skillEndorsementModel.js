const mongoose = require('mongoose');

const skillEndorsementSchema = new mongoose.Schema({
  user_skill_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSkill',
    required: [true, 'User Skill ID is required']
  },
  endorser_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Endorser ID is required']
  }
}, {
  timestamps: true
});

// Ensure a user can only endorse a skill once
skillEndorsementSchema.index({ user_skill_id: 1, endorser_id: 1 }, { unique: true });

// Add index for faster queries
skillEndorsementSchema.index({ user_skill_id: 1, createdAt: -1 });

const SkillEndorsement = mongoose.model('SkillEndorsement', skillEndorsementSchema);

module.exports = SkillEndorsement;