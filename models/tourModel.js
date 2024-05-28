const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema(
  {
    name: {
      unique: true,
      type: String,
      required: [true, 'Tour Name Required'],
      maxlength: [20 , 'Must Be Less Than 20 Characters'],
      minlegnth: [5, 'Must Be Greater Than 5 Characters'], 
    },
    price: {
      required: [true, 'Tour Price Requied'],
      type: Number,
    },
    difficulty: {
      type: String,
      required: [true, 'Tour Difficulty Required'],
      enum: {
        values: ['easy' , 'medium' , 'difficult'],
        message : 'Difficulty is either: easy , medium or difficult',
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1,'Must Be Greater Than 0'],
      max: [5 , 'Must Be Equal To Or Below 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: { 
      type: Number,
      validate: { // Custom Validator Applied
        // it only works when creating new document / not for update
        validator:  function(inputValue){
            return this.price > inputValue;
        },
        message: `Actual Price Should Be Greater Than Dicsount Price ({VALUE})`
      }
    },
    summery: {
      type: String,
      trim: true,
      required: [true, 'Tour Summery Required'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      required: [true, 'Tour Image Required'],
      type: String,
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
      toObject: true,
    },
  },
);

tourSchema.virtual('virtualPrice').get(function () {
  return this.price / 10;
});

//   Mongo Middlewares

// Document Middleware : Runs before the .save() or .create() but not on .insertMnay
tourSchema.pre('save', function (next) {
  tourSchema.virtual('nameSlug').get(function () {
    return slugify(this.name, { lower: true });
  });
  next();
});

tourSchema.pre('save', function (next) {
  console.log('Ran Before Save. Saving .....');
  next();
});

// Runs After The Data Is Saved In DB
tourSchema.post('save', function (data, next) {
  console.log('Data Is Saved');
  // console.log(data);
  next();
});

// Query Middleware
// Regular Expression Used . It will run for all that start with find :- find, findOne , findOneAndDelete, findOneAndUpdate etc
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.timeOne = Date.now();
  next();
});

tourSchema.post(/^find/, function (data, next) {
  console.log(`Total Time: ${Date.now() - this.timeOne} in milliseconds`);
  next();
});

// Aggregate Middleware
tourSchema.pre('aggregate', function () {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
