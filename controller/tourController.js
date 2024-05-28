// const fs = require('fs');
// const path = require('path');

const Tour = require('./../models/tourModel');
const ApiFeatures = require('./../utils/apiFeatures');

const exceptionHandler = require('./../exception/handler');
const AppError = require('../utils/appError');
const { response } = require('express');

// const tourData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../api/tour.json'), 'utf-8'));

exports.checkId = (request, response, next, value) => {
  // console.log(`Tour Id Is: ${value}`);
  // if (request.params.id * 1 > tourData.length) {
  //   return response.status(404).json({
  //     status: 'Error!',
  //     message: 'Invalid ID',
  //   });
  // }
  next();
};

exports.queryMiddleware = (request, response, next) => {
  request.query.limit = 2;
  request.query.sort = '-ratingsAverage,price';
  request.query.fields = 'name,price,ratingsAverage';
  next();
};

exports.validateRequest = (request, response, next) => {
  if (!request.body.name || !request.body.price) {
    return response.status(400).json({
      status: 'Fail',
      message: 'Name or Price Missing',
    });
  }
  next();
};

exports.createTour = exceptionHandler.catchAsync(async (request, response, next) => {
  const newTour = await Tour.create(request.body);
  response.status(200).json({
    status: 'Success',
    data: {
      tour: newTour,
    },
  });
});

exports.getAllTours = exceptionHandler.catchAsync(async (request, response, next) => {
  // Filtering Data
  // const queryObj = { ...request.query };
  // const excludedFields = ['page', 'limit', 'sort', 'fields'];
  // excludedFields.forEach((value) => delete queryObj[value]);

  // Advanced Filtering / Building Query
  // let queryStr = JSON.stringify(queryObj);
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt|eq)\b/g, (match) => `$${match}`);

  // let query = Tour.find(JSON.parse(queryStr));

  //Sorting the query
  // if (request.query.sort) {
  // Handling Multiple Sorting (replace comma with space)
  //   const sortByArray = request.query.sort.split(',').join(' ');
  //   query = query.sort(sortByArray);
  // } else {
  //   query.sort({ createdAt: -1, _id: 1 });
  // }

  // Limiting the Fields From Database (Choosing Only Required Data)
  // if (request.query.fields) {
  //   const fields = request.query.fields.split(',').join(' ');
  //   query = query.select(fields);
  // } else {
  //   query = query.select('-__v');
  // }

  // Pagination And Limiting Data
  // const page = request.query.page * 1 || 1;
  // const limit = request.query.limit * 1 || 100;
  // const skip = (page - 1) * limit;

  // // Apply pagination
  // query = query.skip(skip).limit(limit);

  // Executing the Query
  const features = new ApiFeatures(Tour.find(), request.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const Tours = await features.modelQuery;
  response.status(200).json({
    status: 'Success',
    data: {
      tour: Tours,
    },
  });
});

exports.getSingleTour = exceptionHandler.catchAsync(async (request, response, next) => {
  // const id = request.params.id * 1;
  // const tourDataDetail = tourData.find((tour) => tour.id === id);
  // response.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour: tourDataDetail,
  //   },
  // });

  const tourDataDetail = await Tour.findById(request.params.id);
  if (!tourDataDetail) {
    return next(new AppError('No Tour Data Found', 404));
  }
  response.status(200).json({
    status: 'Success',
    data: {
      tour: tourDataDetail,
    },
  });
});

exports.updateTour = exceptionHandler.catchAsync(async (request, response, next) => {
  const tourData = await Tour.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
  });
  if (!tourData) {
    return next(new AppError('No Tour Data Found', 404));
  }
  response.status(200).json({
    status: 'Success',
    data: {
      tour: tourData,
    },
  });
});
exports.deleteTour = exceptionHandler.catchAsync(async (request, response, next) => {
  const tourData = await Tour.findByIdAndDelete(request.params.id);
  const test = await Tour.findById(request.params.id);
  console.log('DB Answer', test);
  if (!tourData) {
    return next(new AppError('No Tour Data Found', 404));
  }
  response.status(200).json({
    status: 'Success',
    message: 'Tour Deleted Successfully',
  });
});

exports.getTourStats = exceptionHandler.catchAsync(async (request, response, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 },
      },
    },
    {
      $group: {
        _id: '$difficulty', // Group By
        numTotal: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
        numRatings: { $sum: '$ratingsQuantity' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    //  We can use operators
    // {
    //   $match: { _id: {$ne: 'Easy'} } // where _id is not equal to Easy
    // },
  ]);
  response.status(200).json({
    status: 'Success',
    data: {
      stats: stats,
    },
  });
});

exports.getMonthlyPlan = exceptionHandler.catchAsync(async (request, response, next) => {
  const year = request.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numMontlyTours: { $sum: 1 },
        tourName: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: {
        numMontlyTours: -1,
        startDates: -1,
      },
    },
  ]);
  response.status(200).json({
    status: 'Success',
    data: {
      plan: plan,
    },
  });
});
