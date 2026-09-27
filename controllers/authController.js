import catchAsync from './../utils/catchAsync.js';
import User from './../models/userModels.js';
import jwt from 'jsonwebtoken';
import AppError from './../utils/appError.js';
const signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_DURATION,
  });

  res.status(201).json({ status: 'success', token, data: newUser });
});
const logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1.check if the email and password is exist.
  if (!email || !password) {
    return next(new AppError('Please provide emial and password !', 400));
  }
  //2.check if the password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(user.password, password))) {
    return next(new AppError('Incorrect email or password !', 401));
  }
  //3. sending the token back to the client
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_DURATION,
  });
  res.status(200).json({ status: 'success', token });
});
export default { signUp, logIn };
