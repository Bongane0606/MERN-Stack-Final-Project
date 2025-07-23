const express = require('express');
const {
  getTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
  getTripEvents,
  calculateTripScore
} = require('../controllers/trips');

const Trip = require('../models/Trip');

const router = express.Router({ mergeParams: true });

const { protect } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

router.use(protect);

router
  .route('/')
  .get(advancedResults(Trip), getTrips)
  .post(createTrip);

router
  .route('/:id')
  .get(getTrip)
  .put(updateTrip)
  .delete(deleteTrip);

router
  .route('/:id/events')
  .get(getTripEvents);

router
  .route('/:id/score')
  .get(calculateTripScore);

module.exports = router;