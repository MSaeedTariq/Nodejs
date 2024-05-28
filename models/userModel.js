const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User Name Required'],
  },
  email: {
    type: String,
    required: [true, 'User Email Required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'User Email Not Valid'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user' , 'guide' , 'lead-guide' , 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'User Password Required'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'User Confirm Required'],
    validate: {
      // this only works with create, save
      validator: function () {
        return this.passwordConfirm === this.password;
      },
      message: 'Password Must Be Same',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (inputPassword, dbPassword) {
  // we cannot use 'this' here because we have set password select to false
  return await bcrypt.compare(inputPassword, dbPassword);
};

userSchema.methods.changedPasswordAfter = function (TokenTimestamp) {
  if (this.passwordChangedAt) {
    // Converting Date to Time and then Time from seconds to milli seconds * Converting all that to integer and specifying the base which is 10
    const passwordChangedInTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return passwordChangedInTimestamp > TokenTimestamp; // Time when password changed is greater then when token was created
  }
  // False means password not changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
