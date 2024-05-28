const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError.js');
const globalErrorHandler = require('./exception/handler.js');
const tourRoute = require('./routes/tourRouter.js');
const userRoute = require('./routes/userRouter.js');

const app = express();

// Middleware
app.use(express.json());
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
  app.use((request, response, next) => {
    // request.requestTime = new Date().toISOString();
    console.log('Middleware Running In APP.js');
    next();
  });
}

// Middleware For Serving Static Files
app.use(express.static(`${__dirname}/public`));

// Routing
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);

// Custom Middleware For Handling Undefiend Route
app.all('*', (request, response, next) => {
  // response.status(404).json({
  //   status: 'Error',
  //   message: `Route Not Defined. Route ${request.originalUrl} Not Found`,
  // });

  // const error = new Error(`Route Not Defined. Route ${request.originalUrl} Not Found`);
  // error.statusCode = 404;
  // error.status = 'Error';
  // next(error);

  next(new AppError(`Route Not Defined. Route ${request.originalUrl} Not Found` , 404));
});

// Global Error Handling Middleware
app.use(globalErrorHandler.globalExceptionMiddleware);

module.exports = app;
