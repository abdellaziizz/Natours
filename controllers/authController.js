import catchAsync from './../utils/catchAsync.js';
import User from './../models/userModels.js';
import jwt from 'jsonwebtoken';
import AppError from './../utils/appError.js';
import util from 'util';
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
const protect = catchAsync(async (req, res, next) => {
  let token;

  // 1.Get the token and do some checking:
  if (
    req.header.authorization &&
    req.header.authorization.startsWith('Bearer')
  ) {
    token = req.header.authorization.split(' ')[1];
  }
  if (!token) {
    next(new AppError('You are not logged in to get access !', 401));
  }
  // 2.Verify if the token is valid or not "this is called verification"
  const verify = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET,
  );
  // 3.Check if the user that tries to get access is still exist or not
  const freshUser = await User.findById(verify.id);
  if (!freshUser) {
    return next(
      new AppError('The user of this tokens does no longer exist !', 401),
    );
  }
  //after all of this success, go to the route handler
  req.user = freshUser;
  next();
});
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.include(req.user.role)) {
      return next(
        new AppError('You Do not have permission for these resources', 403),
      );
    }
    next();
  };
};
const forgotPassword = catchAsync(async (req, res, next) => {
  //1.Get the user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('user does not exist !', 404));
  }
  //2.Generate the reset "random" token
  //3.Send it to the user's email
});
const resetPassword = (req, res, next) => {};
export default {
  signUp,
  logIn,
  protect,
  authorize,
  forgotPassword,
  resetPassword,
};
