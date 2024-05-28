const express = require('express');
const tourController = require('./../controller/tourController.js');
const authController = require('./../controller/authController.js');

const router = express.Router();

// Named Query Route
router.route('/top-2-cheap').get(tourController.queryMiddleware, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/tour-monthly-plans/:year').get(tourController.getMonthlyPlan);

// Raram Middleware
router.param('id', tourController.checkId); 

router
  .route('/')
  .get(authController.authUser, tourController.getAllTours)
  .post(tourController.validateRequest, tourController.createTour);
router
  .route('/:id')
  .get(tourController.getSingleTour)
  .patch(tourController.updateTour)
  .delete(authController.authUser , authController.allowedAccessTo('admin' , 'lead-guide') , tourController.deleteTour);



module.exports = router;
