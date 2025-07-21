const express = require('express');
const {
  getEmergencies,
  getEmergency,
  createEmergency,
  updateEmergency,
  deleteEmergency,
  respondToEmergency
} = require('../controllers/emergencies');

const Emergency = require('../models/emergency');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

router.use(protect);

router
  .route('/')
  .get(advancedResults(Emergency), getEmergencies)
  .post(createEmergency);

router
  .route('/:id')
  .get(getEmergency)
  .put(updateEmergency)
  .delete(deleteEmergency);

router
  .route('/:id/respond')
  .post(authorize('admin', 'fleet'), respondToEmergency);

module.exports = router;