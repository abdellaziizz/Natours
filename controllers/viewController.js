import catchAsync from '../utils/catchAsync.js';
import Tours from './../models/tourModels.js';
const getOverview = catchAsync(async (req, res, next) => {
  //1.GET the documents from the collection
  const tours = await Tours.find();
  res.status(200).render('overview', { title: 'All Tours', tours });
});
const getTour = catchAsync(async (req, res) => {
  const tour = await Tours.findOne({ slug: req.params.id }).populate({
    path: 'reviews',
    select: 'review rating user',
  });
  if (!tour) {
    return next(new AppError('No tour found with that slug', 404));
  }
  res.status(200).render('tour', { title: `${tour.name} Tour`, tour });
});
const getLoginForm = catchAsync(async (req, res) => {
  res.status(200).render('login', { title: 'Log into your account' });
});
const getAccount = (req, res) => {
  res.status(200).render('account', { title: 'Your account' });
};
export default { getOverview, getTour, getLoginForm, getAccount };
