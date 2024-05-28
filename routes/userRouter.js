const express = require('express');
const userController = require('./../controller/userController.js');
const authController = require('./../controller/authController.js');


const router = express.Router();

router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.login);

router.route('/').get(userController.getAllUsers).post(userController.createUser);
router.route('/:id').get(userController.getSingleUser).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = router;
