import catchAsync from './../utils/catchAsync.js';
import APIFeatures from '../utils/APIFeature.js';
import User from '../models/userModels.js';
import AppError from '../utils/appError.js';
import factory from './handlerFactory.js';

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  //object.keys return an array of object keys
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};
const getAllUsers = catchAsync(async (req, res, next) => {
  //Execute Query

  const users = await User.find();

  res
    .status(200)
    .json({ stats: 'success', results: users.length, data: { users } });
});
const updateMe = catchAsync(async (req, res, next) => {
  //1.create error if the user try to POST password
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'This route is note for password update. use the /updateMyPassword instead',
        400,
      ),
    );
  }
  //2.update user document
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true, //new is for returning the updated document as object
    runValidators: true,
  });
  res.status(200).json({ status: 'success', data: { user: updatedUser } });
});
const postUsers = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'this route is not handled yet' });
};
const updateUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'this route is not handled yet' });
};
const deleteUser = factory.deleteOne(User);
const getUsersById = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'this route is not handled yet' });
};
const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({ status: 'success', data: null });
});
export default {
  getAllUsers,
  postUsers,
  updateUser,
  deleteUser,
  getUsersById,
  updateMe,
  deleteMe,
};
