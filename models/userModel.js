const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { type } = require('os');

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
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
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
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save' , function(){
  if(!this.isModified('password') || this.isNew){
    return next();
  }
  this.passwordChangedAt = Date.now() - 1000; // Subtracting One Second or 1000 MilliSecind because somethime the paswordChangedAt happends later on and causes confusion
  next();
})

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

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 100;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
