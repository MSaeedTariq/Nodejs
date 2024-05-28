const User = require('./../models/userModel');
const exceptionHandler = require('./../exception/handler');
const AppError = require('./../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObject = {};
  Object.keys(obj).forEach((indexValue) => {
    if (allowedFields.includes(indexValue)) {
      newObject[indexValue] = obj[indexValue];
    }
  });
  return newObject;
};

exports.updatedData = exceptionHandler.catchAsync(async (request, response, next) => {});

exports.getAllUsers = exceptionHandler.catchAsync(async (request, respone, next) => {
  const userData = await User.find();
  respone.status(200).json({
    status: 'success',
    data: {
      user: userData,
    },
  });
});

exports.getSingleUser = (request, response) => {};

exports.updateUser = exceptionHandler.catchAsync(async (request, response) => {
  if (request.body.password || request.body.passwordConfirm) {
    return next(new AppError('Please use the /update-password route for updating password', 400));
  }

  // Filter Out Unwanted Field Names from the incomming request which are not to be updated
  const fillableData = filterObj(request.body, 'name', 'email');
  const updatedData = await User.findByIdAndUpdate(request.user.id, fillableData, {
    new: true,
    runValidators: true,
  });

  response.status(200).json({
    status: 'Success',
    data: {
      userData: updatedData,
    },
  });
});

exports.deleteUser = exceptionHandler.catchAsync(async (request, response, next) => {
  await User.findByIdAndUpdate(request.user.id, { accountActive: false });

  response.status(204).json({
    status: 'Success',
  });
});

exports.createUser = (request, response) => {};
