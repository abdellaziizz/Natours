import catchAsync from './../utils/catchAsync.js';
import User from './../models/userModels.js';
import jwt from 'jsonwebtoken';
const signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
  const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_DURATION,
  });

  res.status(201).json({ status: 'success', token, data: newUser });
});
export default signUp;
