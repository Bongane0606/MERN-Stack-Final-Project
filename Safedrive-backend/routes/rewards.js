const express = require('express');
const {
  getRewards,
  getReward,
  createReward,
  updateReward,
  deleteReward,
  redeemReward
} = require('../controllers/rewards');

const Reward = require('../models/Reward');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

router.use(protect);

router
  .route('/')
  .get(advancedResults(Reward), getRewards)
  .post(authorize('admin'), createReward);

router
  .route('/:id')
  .get(getReward)
  .put(authorize('admin'), updateReward)
  .delete(authorize('admin'), deleteReward);

router
  .route('/:id/redeem')
  .post(redeemReward);

module.exports = router;