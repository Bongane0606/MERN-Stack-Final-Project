const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Create user
// @route   POST /api/v1/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Add emergency contact
// @route   POST /api/v1/users/:id/contacts
// @access  Private
exports.addEmergencyContact = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $push: { emergencyContacts: req.body } },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: user.emergencyContacts
  });
});

// @desc    Remove emergency contact
// @route   DELETE /api/v1/users/:id/contacts
// @access  Private
exports.removeEmergencyContact = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $pull: { emergencyContacts: { _id: req.body.contactId } } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: user.emergencyContacts
  });
});

// @desc    Get user trips
// @route   GET /api/v1/users/:id/trips
// @access  Private
exports.getUserTrips = asyncHandler(async (req, res, next) => {
  if (req.params.id !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Not authorized to view this user's trips`, 403)
    );
  }

  const trips = await Trip.find({ user: req.params.id });

  res.status(200).json({
    success: true,
    count: trips.length,
    data: trips
  });
});

// @desc    Get user rewards
// @route   GET /api/v1/users/:id/rewards
// @access  Private
exports.getUserRewards = asyncHandler(async (req, res, next) => {
  if (req.params.id !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Not authorized to view this user's rewards`, 403)
    );
  }

  const redemptions = await Redemption.find({ user: req.params.id })
    .populate('reward')
    .sort('-redeemedAt');

  res.status(200).json({
    success: true,
    count: redemptions.length,
    data: redemptions
  });
});