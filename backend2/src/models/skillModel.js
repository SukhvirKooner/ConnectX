const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
    unique: true
  },
  category: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Add text index for search
skillSchema.index({ name: 'text', category: 'text' });

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;