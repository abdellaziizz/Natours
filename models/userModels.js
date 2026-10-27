import crypto from 'crypto';
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'User must have name'], trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  photo: { type: String, default: 'public/img/users/default.jpg' },
  password: {
    type: String,
    required: [true, 'Please provide a valid password'],
    minlength: 8,
    select: false,
  },

  confirmPassword: {
    type: String,
    required: [true, 'Please provide a valid password'],
    validate: {
      validator: function (el) {
        if (el === this.password) return true;
      },
      message: 'password are not the same',
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpireAt: Date,
  },
  active: { type: Boolean, default: true, select: false },
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(userPassword, candidatePassword);
};
userSchema.methods.changePassword = function (JWTTimeStamp) {
  if (this.passwordChangeAt) {
    //convert to millyseconds
    const changeTime = parseInt(this.passwordChangeAt.getTime() / 1000, 10);
    console.log(changeTime, JWTTimeStamp);
    return true;
  }
  //false means not changed
  return false;
};
userSchema.methods.createPassResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpireAt = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
});
//this is for any query that start with find like findOne, findById, findByIdAndUpdate, findByIdAndDelete
//this pre middleware will run in order to filter the data and return only active users
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
const User = mongoose.model('User', userSchema);
export default User;
