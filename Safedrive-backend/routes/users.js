const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  addEmergencyContact,
  removeEmergencyContact,
  getUserTrips,
  getUserRewards
} = require('../controllers/users');

const User = require('../models/User');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

router.use(protect);

router
  .route('/')
  .get(advancedResults(User), getUsers)
  .post(authorize('admin'), createUser);

router
  .route('/:id')
  .get(getUser)
  .put(authorize('admin'), updateUser)
  .delete(authorize('admin'), deleteUser);

router
  .route('/:id/contacts')
  .post(addEmergencyContact)
  .delete(removeEmergencyContact);

router
  .route('/:id/trips')
  .get(getUserTrips);

router
  .route('/:id/rewards')
  .get(getUserRewards);

module.exports = router;