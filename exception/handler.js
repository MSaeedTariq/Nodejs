const AppError = require('./../utils/appError');

const sendErrorDevelopment = (error, response) => {
  response.status(error.statusCode).json({
    status: error.status,
    error: error,
    message: error.message,
    stack: error.stack,
  });
};

const sendErrorProduction = (error, response) => {
  // If error is indeed operational then send true error message
  if (error.isOperational) {
    response.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    // Otherwise send standard message
    console.error(error);
    response.status(500).json({
      status: 'Error',
      message: 'Something Went Wrong. SendErrorProduction, Not Operational Error',
    });
  }
};

const handleValidationErrorDB = (error) => {
  const errors = Object.values(error.errors).map((el) => el.message);
  const message = `Invalid Input Data ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleErrorDB = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldErrorDB = (error) => {
  const nameRegex = /dup key: { name: "(.+?)" }/;
  const value = error.message.match(nameRegex);
  const message = `Duplicate Field ${value[1]}.Please Use Another`;
  return new AppError(message, 400);
};

const handleJWTError = (error) => {
  return new AppError('Invalid Token. Login Again', 401);
};

const handleJWTExpirationError = (error) => {
  return new AppError('Auth Token Expired. Login Again', 401);
};

exports.globalExceptionMiddleware = (error, request, response, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'Error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDevelopment(error, response);
  } else if (process.env.NODE_ENV === 'production') {
    let err = { ...error, name: error.name, message: error.message, stack: error.stack };

    if (err.name === 'CastError') {
      err = handleErrorDB(err);
    }
    if (err.code == 11000) {
      err = handleDuplicateFieldErrorDB(err);
    }
    if (err.name === 'ValidationError') {
      err = handleValidationErrorDB(err);
    }
    if (err.name === 'JsonWebTokenError') {
      err = handleJWTError(err);
    }
    if (err.name === 'TokenExpiredError') {
      err = handleJWTExpirationError(err);
    }
    sendErrorProduction(err, response);
  }
  next();
};

exports.catchAsync = (ftn) => {
  return (request, response, next) => {
    ftn(request, response, next).catch(next);
  };
};
