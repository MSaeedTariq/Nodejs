const express = require('express');
const userController = require('./../controller/userController.js');
const authController = require('./../controller/authController.js');

const router = express.Router();

router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.login);

router.route('/forgot-password').post(authController.forgotPassword);
router.route('/reset-password/:token').patch(authController.resetPassword);
router.route('/update-password').patch(authController.authUser , authController.updatePassword);
router.route('/update-user-data').patch(authController.authUser , userController.updateUser);
router.route('/delete-user').get(authController.authUser , userController.deleteUser);

router.route('/').get(userController.getAllUsers).post(userController.createUser);
router
  .route('/:id')
  .get(userController.getSingleUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
