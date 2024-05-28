const User = require('./../models/userModel');
const exceptionHandler = require('./../exception/handler');

exports.getAllUsers = exceptionHandler.catchAsync( async (request, respone) => {
  const userData = await User.find();
    respone.status(200).json({
      status: 'success',
      data: {
        user: userData,
      },
    });
  });
  
  exports.getSingleUser = (request, response) => {
    
  };
  
  exports.updateUser = (request, response) => {
    // const id = request.params.id * 1;
    // const tourDataDetail = tourData.find((tour) => tour.id === id);
    // response.status(200).json({
    //   status: 'success',
    //   data: {
    //     tour: tourDataDetail,
    //   },
    // });
  };
  
  exports.deleteUser = (request, response) => {
    // const id = request.params.id * 1;
    // const tourDataDetail = tourData.find((tour) => tour.id === id);
    // response.status(200).json({
    //   status: 'success',
    //   data: {
    //     tour: tourDataDetail,
    //   },
    // });
  };
  
  exports.createUser = (request, response) => {
  
  };