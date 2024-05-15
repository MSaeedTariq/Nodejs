exports.getAllUsers = (request, respone) => {
    respone.status(200).json({
      status: 'success',
      data: {
        message: 'Working',
      },
    });
  };
  
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