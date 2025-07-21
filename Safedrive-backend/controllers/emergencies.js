const Emergency = require('../models/emergency');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all emergencies
// @route   GET /api/v1/emergencies
// @access  Private/Admin
exports.getEmergencies = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single emergency
// @route   GET /api/v1/emergencies/:id
// @access  Private
exports.getEmergency = asyncHandler(async (req, res, next) => {
  const emergency = await Emergency.findById(req.params.id);

  if (!emergency) {
    return next(
      new ErrorResponse(`Emergency not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user owns the emergency or is admin
  if (emergency.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Not authorized to access this emergency`, 401)
    );
  }

  res.status(200).json({
    success: true,
    data: emergency
  });
});

// @desc    Create emergency
// @route   POST /api/v1/emergencies
// @access  Private
exports.createEmergency = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  const emergency = await Emergency.create(req.body);

  // Emit real-time alert to emergency responders
  req.io.to('emergency-responders').emit('new-emergency', {
    emergencyId: emergency._id,
    userId: req.user.id,
    location: emergency.location,
    emergencyType: emergency.emergencyType,
    createdAt: emergency.createdAt
  });

  // Notify user's emergency contacts
  const user = await User.findById(req.user.id).select('emergencyContacts');
  user.emergencyContacts.forEach(contact => {
    // In a real app, you would send SMS/email here
    req.io.to(`user-${req.user.id}`).emit('emergency-notification', {
      contactName: contact.name,
      status: 'notified'
    });
  });

  res.status(201).json({
    success: true,
    data: emergency
  });
});

// @desc    Update emergency
// @route   PUT /api/v1/emergencies/:id
// @access  Private/Admin
exports.updateEmergency = asyncHandler(async (req, res, next) => {
  let emergency = await Emergency.findById(req.params.id);

  if (!emergency) {
    return next(
      new ErrorResponse(`Emergency not found with id of ${req.params.id}`, 404)
    );
  }

  emergency = await Emergency.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: emergency
  });
});

// @desc    Delete emergency
// @route   DELETE /api/v1/emergencies/:id
// @access  Private/Admin
exports.deleteEmergency = asyncHandler(async (req, res, next) => {
  const emergency = await Emergency.findById(req.params.id);

  if (!emergency) {
    return next(
      new ErrorResponse(`Emergency not found with id of ${req.params.id}`, 404)
    );
  }

  await emergency.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Respond to emergency
// @route   POST /api/v1/emergencies/:id/respond
// @access  Private/Admin
exports.respondToEmergency = asyncHandler(async (req, res, next) => {
  let emergency = await Emergency.findById(req.params.id);

  if (!emergency) {
    return next(
      new ErrorResponse(`No emergency with the id of ${req.params.id}`, 404)
    );
  }

  // Update emergency status and add responder
  emergency.status = 'active';
  emergency.responders.push({
    type: req.body.responderType,
    status: 'dispatched'
  });

  await emergency.save();

  // Notify user that help is on the way
  req.io.to(`user-${emergency.user}`).emit('emergency-response', {
    emergencyId: emergency._id,
    responderType: req.body.responderType,
    status: 'dispatched'
  });

  res.status(200).json({
    success: true,
    data: emergency
  });
});