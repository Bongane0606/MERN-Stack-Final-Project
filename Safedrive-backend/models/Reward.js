// models/Reward.js
const mongoose = require('mongoose');

const RewardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a reward name']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  pointsRequired: {
    type: Number,
    required: [true, 'Please add points required']
  },
  category: {
    type: String,
    enum: ['fuel', 'insurance', 'retail', 'service', 'other'],
    required: true
  },
  partner: {
    type: mongoose.Schema.ObjectId,
    ref: 'Partner'
  },
  image: {
    type: String
  },
  expiryDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Reward', RewardSchema);