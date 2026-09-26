import mongoose from 'mongoose';
import validator from 'validator';
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
    type: Number,
    required: [true, 'Please provide a valid password'],
    minlength: 8,
  },

  confirmPassword: {
    type: Number,
    required: [true, 'Please provide a valid password'],
  },
});
const User = mongoose.model('User', useuserSchemars);
