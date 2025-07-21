const Reward = require('../models/Reward');
const Redemption = require('../models/Redemption');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all rewards
// @route   GET /api/v1/rewards
// @access  Private
exports.getRewards = asyncHandler(async (req, res, next) => {
  // Filter by category if specified
  if (req.query.category) {
    req.query.category = { $in: req.query.category.split(',') };
  }

  // Only show active rewards by default
  if (typeof req.query.isActive === 'undefined') {
    req.query.isActive = true;
  }

  res.status(200).json(res.advancedResults);
});

// @desc    Get single reward
// @route   GET /api/v1/rewards/:id
// @access  Private
exports.getReward = asyncHandler(async (req, res, next) => {
  const reward = await Reward.findById(req.params.id);

  if (!reward) {
    return next(
      new ErrorResponse(`Reward not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: reward
  });
});

// @desc    Create reward
// @route   POST /api/v1/rewards
// @access  Private/Admin
exports.createReward = asyncHandler(async (req, res, next) => {
  const reward = await Reward.create(req.body);

  res.status(201).json({
    success: true,
    data: reward
  });
});

// @desc    Update reward
// @route   PUT /api/v1/rewards/:id
// @access  Private/Admin
exports.updateReward = asyncHandler(async (req, res, next) => {
  const reward = await Reward.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!reward) {
    return next(
      new ErrorResponse(`Reward not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: reward
  });
});

// @desc    Delete reward
// @route   DELETE /api/v1/rewards/:id
// @access  Private/Admin
exports.deleteReward = asyncHandler(async (req, res, next) => {
  const reward = await Reward.findById(req.params.id);

  if (!reward) {
    return next(
      new ErrorResponse(`Reward not found with id of ${req.params.id}`, 404)
    );
  }

  await reward.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Redeem reward
// @route   POST /api/v1/rewards/:id/redeem
// @access  Private
exports.redeemReward = asyncHandler(async (req, res, next) => {
  const reward = await Reward.findById(req.params.id);
  const user = await User.findById(req.user.id);

  if (!reward) {
    return next(
      new ErrorResponse(`Reward not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if reward is active
  if (!reward.isActive) {
    return next(
      new ErrorResponse(`This reward is no longer available`, 400)
    );
  }

  // Check if user has enough points
  if (user.points < reward.pointsRequired) {
    return next(
      new ErrorResponse(`Not enough points to redeem this reward`, 400)
    );
  }

  // Create redemption record
  const redemption = await Redemption.create({
    user: req.user.id,
    reward: req.params.id,
    pointsUsed: reward.pointsRequired,
    redemptionCode: `SD-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
  });

  // Deduct points from user
  user.points -= reward.pointsRequired;
  await user.save();

  // Emit redemption event
  req.io.to(`user-${req.user.id}`).emit('reward-redeemed', {
    rewardId: reward._id,
    rewardName: reward.name,
    pointsUsed: reward.pointsRequired,
    remainingPoints: user.points,
    redemptionCode: redemption.redemptionCode
  });

  res.status(200).json({
    success: true,
    data: redemption
  });
});