const express = require('express');
const tourController = require('./../controller/tourController.js');

const router = express.Router();

// Named Query Route
router.route('/top-2-cheap').get(tourController.queryMiddleware , tourController.getAllTours)

// Raram Middleware
router.param('id' , tourController.checkId);

router.route('/').get(tourController.getAllTours).post(tourController.validateRequest , tourController.createTour);
router.route('/:id').get(tourController.getSingleTour).patch(tourController.updateTour).delete(tourController.deleteTour);

module.exports = router;
