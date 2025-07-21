// models/Trip.js
const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  startLocation: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere'
    },
    address: String
  },
  endLocation: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    address: String
  },
  distance: {
    type: Number,
    required: true
  },
  duration: {
    type: Number
  },
  events: [
    {
      type: {
        type: String,
        enum: ['hard_brake', 'rapid_acceleration', 'speeding', 'phone_usage', 'sharp_turn'],
        required: true
      },
      timestamp: {
        type: Date,
        required: true
      },
      location: {
        type: {
          type: String,
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
      severity: {
        type: Number,
        min: 1,
        max: 5
      }
    }
  ],
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

TripSchema.index({ user: 1, startTime: -1 });

module.exports = mongoose.model('Trip', TripSchema);