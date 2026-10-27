import catchAsync from './../utils/catchAsync.js';
import APIFeatures from '../utils/APIFeature.js';
import User from '../models/userModels.js';
import AppError from '../utils/appError.js';
import factory from './handlerFactory.js';
import multer from 'multer';
import sharp from 'sharp';
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const extension = file.mimetype.split('/')[1]; //image/jpeg
//     cb(null, `user-${req.user.id}-${Date.now()}.${extension}`);
//   },
// });
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image', 400), false);
  }
};
const update = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const upladUserPhoto = update.single('photo');
const resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();
  req.file.filemame = `user-${req.user.id}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
};
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
const getAllUsers = factory.getAll(User);
const getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});
const createUser = catchAsync(async (req, res, next) => {
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
const getUserById = factory.getOne(User);
const postUsers = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'this route is not handled yet' });
};
// Don't update password with this
const updateUser = factory.updateOne(User);
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
  createUser,
  deleteMe,
  getUserById,
  getMe,
  upladUserPhoto,
  resizeUserPhoto,
};
