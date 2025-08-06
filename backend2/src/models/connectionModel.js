const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
  requester_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Requester ID is required']
  },
  addressee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Addressee ID is required']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  message: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Ensure a user can only send one connection request to another user
connectionSchema.index({ requester_id: 1, addressee_id: 1 }, { unique: true });

// Add indexes for faster queries
connectionSchema.index({ requester_id: 1, status: 1 });
connectionSchema.index({ addressee_id: 1, status: 1 });

const Connection = mongoose.model('Connection', connectionSchema);

module.exports = Connection;