const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema({
    name: {
      unique: true,
      type: String,
      required: [true , 'Tour Name Required'] 
    },
    price: {
      required: [true , 'Tour Price Requied'],
      type: Number
    },
    difficulty: {
        type: String,
        required : [true , 'Tour Difficulty Required']
    },
    ratingsAverage: {
      type: Number,
      default :4.5
    },
    ratingsQuantity:{
        type: Number,
        default: 0
    },
    priceDiscount: {
        type : Number,
    },
    summery: {
        type: String,
        trim: true,
        required: [true , 'Tour Summery Required']
    },
    description: {
        type: String,
        trim : true,
    },
    imageCover:{
        required: [true, 'Tour Image Required'],
        type: String,
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
  });
  
  const Tour = mongoose.model('Tour' , tourSchema);

  module.exports = Tour;