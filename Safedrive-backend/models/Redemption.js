// models/Redemption.js
const mongoose = require('mongoose');

const RedemptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  reward: {
    type: mongoose.Schema.ObjectId,
    ref: 'Reward',
    required: true
  },
  pointsUsed: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  redemptionCode: {
    type: String
  },
  redeemedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Redemption', RedemptionSchema);