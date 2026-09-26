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
  photo: { type: String },
  password: {
    type: String,
    required: [true, 'Please provide a valid password'],
    minlength: 8,
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
  },
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
});
const User = mongoose.model('User', userSchema);
export default User;
