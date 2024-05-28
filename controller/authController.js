const util = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const exceptionHandler = require('./../exception/handler');
const AppError = require('./../utils/appError');

const signedToken = (userID) => {
  return jwt.sign({ id: userID }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPERATION_TIME,
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
  const token = signedToken(userData._id);
  response.status(201).json({
    status: 'Success',
    token,
    data: {
      user: userData,
    },
  });
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
  response.status(201).json({
    status: 'Success',
    token,
    data: {
      user: userData,
    },
  });
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
