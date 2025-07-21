const Trip = require('../models/Trip');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all trips
// @route   GET /api/v1/trips
// @access  Private
exports.getTrips = asyncHandler(async (req, res, next) => {
  // If not admin, only show user's trips
  if (req.user.role !== 'admin') {
    req.query.user = req.user.id;
  }

  res.status(200).json(res.advancedResults);
});

// @desc    Get single trip
// @route   GET /api/v1/trips/:id
// @access  Private
exports.getTrip = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    return next(
      new ErrorResponse(`Trip not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user owns the trip or is admin
  if (trip.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Not authorized to access this trip`, 401)
    );
  }

  res.status(200).json({
    success: true,
    data: trip
  });
});

// @desc    Create trip
// @route   POST /api/v1/trips
// @access  Private
exports.createTrip = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  const trip = await Trip.create(req.body);

  // Emit real-time trip start event
  req.io.to(`user-${req.user.id}`).emit('trip-started', {
    tripId: trip._id,
    startTime: trip.startTime,
    startLocation: trip.startLocation
  });

  res.status(201).json({
    success: true,
    data: trip
  });
});

// @desc    Update trip
// @route   PUT /api/v1/trips/:id
// @access  Private
exports.updateTrip = asyncHandler(async (req, res, next) => {
  let trip = await Trip.findById(req.params.id);

  if (!trip) {
    return next(
      new ErrorResponse(`Trip not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user owns the trip or is admin
  if (trip.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Not authorized to update this trip`, 401)
    );
  }

  trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // If trip is being completed, emit event
  if (req.body.endTime && !trip.endTime) {
    req.io.to(`user-${req.user.id}`).emit('trip-completed', {
      tripId: trip._id,
      endTime: trip.endTime,
      pointsEarned: trip.pointsEarned
    });
  }

  res.status(200).json({
    success: true,
    data: trip
  });
});

// @desc    Delete trip
// @route   DELETE /api/v1/trips/:id
// @access  Private
exports.deleteTrip = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    return next(
      new ErrorResponse(`Trip not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user owns the trip or is admin
  if (trip.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Not authorized to delete this trip`, 401)
    );
  }

  await trip.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get trip events
// @route   GET /api/v1/trips/:id/events
// @access  Private
exports.getTripEvents = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    return next(
      new ErrorResponse(`Trip not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user owns the trip or is admin
  if (trip.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Not authorized to access this trip's events`, 401)
    );
  }

  res.status(200).json({
    success: true,
    count: trip.events.length,
    data: trip.events
  });
});

// @desc    Calculate trip score
// @route   GET /api/v1/trips/:id/score
// @access  Private
exports.calculateTripScore = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    return next(
      new ErrorResponse(`No trip with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user owns the trip or is admin
  if (trip.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Not authorized to access this trip`, 401)
    );
  }

  // Calculate score based on events (simplified example)
  let score = 100;
  const eventPenalties = {
    hard_brake: 5,
    rapid_acceleration: 5,
    speeding: 10,
    phone_usage: 15,
    sharp_turn: 7
  };

  trip.events.forEach(event => {
    const penalty = eventPenalties[event.type] || 0;
    const severityMultiplier = event.severity ? event.severity / 5 : 1;
    score -= penalty * severityMultiplier;
  });

  // Ensure score doesn't go below 0
  score = Math.max(0, Math.round(score));

  // Calculate points earned (simplified example)
  const pointsEarned = Math.floor((score / 100) * (trip.distance / 10));

  // Update trip with score and points
  trip.score = score;
  trip.pointsEarned = pointsEarned;
  await trip.save();

  // Update user's total points
  await User.findByIdAndUpdate(req.user.id, {
    $inc: { points: pointsEarned }
  });

  res.status(200).json({
    success: true,
    data: {
      score,
      pointsEarned,
      distance: trip.distance,
      eventCount: trip.events.length
    }
  });
});