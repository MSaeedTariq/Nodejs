const crypto = require('crypto');
const util = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const exceptionHandler = require('./../exception/handler');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');
const { response } = require('express');

const signedToken = (userID) => {
  return jwt.sign({ id: userID }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPERATION_TIME,
  });
};

const createSendToken = (user, statusCode, response) => {
  const token = signedToken(user._id);
  response.status(statusCode).json({
    status: 'Success',
    token,
    data: {
      user: user,
    },
  });
};

exports.signUp = exceptionHandler.catchAsync(async (request, response, next) => {
  // const userData = await User.create(request.body);
  const userData = await User.create({
    name: request.body.name,
    email: request.body.email,
    photo: request.body.photo,
    password: request.body.password,
    passwordConfirm: request.body.passwordConfirm,
    passwordChangedAt: request.body.passwordChangedAt,
    role: request.body.role,
  });
  createSendToken(userData, 201, response);
});

exports.login = exceptionHandler.catchAsync(async (request, response, next) => {
  const email = request.body.email;
  const password = request.body.password;
  // const {email, password} = request.body; // Onbject Destructuring

  if (!email || !password) {
    return next(new AppError('Please provide correct email or password', 400));
  }

  const userData = await User.findOne({ email: email }).select('+password'); // we are doing this beacause be default the password is set to not selected hence the + sign
  if (!userData || !(await userData.correctPassword(password, userData.password))) {
    return next(new AppError('Incorrect Email Or Password'), 401);
  }
  const token = signedToken(userData._id);
  createSendToken(userData, 200, response);
});

exports.authUser = exceptionHandler.catchAsync(async (request, response, next) => {
  // Check if there is token
  let token;
  if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
    token = request.headers.authorization.split(' ')[1];
  }
  if (!token) return next(new AppError('Unauthorized Access. Login First'), 401);

  // Token Verification
  const decoded_token = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded_token);

  // Check If User Exists
  const valid_user = await User.findById(decoded_token.id);
  if (!valid_user) {
    return next(new AppError('User For Current Token No Longer Exists', 401));
  }

  // Check If User Changed Password After Token was created
  if (valid_user.changedPasswordAfter(decoded_token.iat)) {
    return next(new AppError('Password Changed After Token Creation , Login Again', 401));
  }

  request.user = valid_user;
  // Grant Access To Protected Route
  next();
});

exports.allowedAccessTo = (...roles) => {
  return (request, response, next) => {
    if (!roles.includes(request.user.role)) {
      return next(new AppError('You Are Not Authorized', 403));
    }
    next();
  };
};

exports.forgotPassword = exceptionHandler.catchAsync(async (request, response, next) => {
  const user = await User.findOne({ email: request.body.email });
  if (!user) {
    return next(new AppError('Invalid Email Entered. No User Found', 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false }); // Saving the user in the db // making all validators false

  const resetURL = `${request.protocol}://${request.get('host')}/api/v1/users/reset-password/${resetToken}`;
  const message = `Forgot Your Password? Submit the Patch Request with you new password and passwordConfirm to :${resetURL}.\nIF you didin't forgot your passwrod then ignore this message`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your Password Reset Token (Valid for 10 Mins)',
      message,
    });

    response.status(200).json({
      status: 'Success',
      message: 'Token Sent To Email',
    });
  } catch (error) {
    console.log(error);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false }); // Saving the user in the db // making all validators false
    return next(new AppError('Error Sending The Email, Try Again', 500));
  }
});

exports.resetPassword = exceptionHandler.catchAsync(async (request, response, next) => {
  const hasedToken = crypto.createHash('sha256').update(request.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hasedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Invalid Token Or Has Expired', 400));
  }

  user.password = request.body.password;
  user.passwordConfirm = request.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, response);
});

exports.updatePassword = exceptionHandler.catchAsync(async (request, response, next) => {
  const user = await User.findById(request.user.id).select('+password');
  const valid_password = await user.correctPassword(request.body.passwordCurrent, user.password);
  if (!valid_password) {
    return next(new AppError('Ivalid Password Entered', 401));
  }

  user.password = request.body.password;
  user.passwordConfirm = request.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, response);
});
