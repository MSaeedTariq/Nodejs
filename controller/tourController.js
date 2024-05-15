// const fs = require('fs');
// const path = require('path');
const Tour = require('./../models/tourModel');
const ApiFeatures = require('./../utils/apiFeatures');

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

exports.createTour = async (request, response) => {
  // const newId = tourData[tourData.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, request.body);
  // tourData.push(newTour);
  // fs.writeFile(path.resolve(__dirname , '../api/tour.json'), JSON.stringify(tourData), (error) => {
  //   if (error) return console.log('Error! File Not Saved');
  //   response.status(201).json({
  //     status: 'success',
  //     data: {
  //       tours: tourData,
  //     },
  //   });
  // });

  try {
    const newTour = await Tour.create(request.body);
    response.status(200).json({
      status: 'Success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    response.status(400).json({
      status: 'Error',
      message: error,
    });
  }
};

exports.getAllTours = async (request, response) => {
  // respone.status(200).json({
  //   status: 'success',
  //   data: {
  //     tours: tourData,
  //   },
  // });

  try {
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
    console.log(`Features , ${features}`);
    const Tours = await features.modelQuery;
    response.status(200).json({
      status: 'Success',
      data: {
        tour: Tours,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getSingleTour = async (request, response) => {
  // const id = request.params.id * 1;
  // const tourDataDetail = tourData.find((tour) => tour.id === id);
  // response.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour: tourDataDetail,
  //   },
  // });
  try {
    const tourDataDetail = await Tour.findById(request.params.id);
    response.status(200).json({
      status: 'Success',
      data: {
        tour: tourDataDetail,
      },
    });
  } catch (error) {
    response.status(200).json({
      status: 'Error',
      message: error,
    });
  }
};

exports.updateTour = async (request, response) => {
  try {
    const tourData = await Tour.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true,
    });
    response.status(200).json({
      status: 'Success',
      data: {
        tour: tourData,
      },
    });
  } catch (error) {
    response.status(404).json({
      status: 'Error',
      message: error,
    });
  }
};
exports.deleteTour = async (request, response) => {
  try {
    await Tour.findByIdAndDelete(request.params.id);
    response.status(200).json({
      status: 'Success',
    });
  } catch (error) {
    response.status(404).josn({
      status: 'Error',
      message: error,
    });
  }
};
