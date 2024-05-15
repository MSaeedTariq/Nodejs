const express = require('express');
const morgan = require('morgan');
const tourRoute = require('./routes/tourRouter.js');
const userRoute = require('./routes/userRouter.js');

const app = express();

// Middleware
app.use(express.json());
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
  app.use((request, response, next) => {
    request.requestTime = new Date().toISOString();
    console.log('Middleware Running In APP.js');
    next();
  });
}

// Middleware For Serving Static Files
app.use(express.static(`${__dirname}/public`));

// Routing
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);

module.exports = app;
