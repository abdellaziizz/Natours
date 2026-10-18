import APIFeatures from '../utils/APIFeature.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from './../utils/appError.js';
import Review from '../models/reviewModels.js';

const getAllReviews = catchAsync(async (req, res, next) => {
  const feature = new APIFeatures(Review.find(), req.query);
  feature.filter().sorting().limitFields().paginate();
  const reviews = await feature.query();
  res
    .status(200)
    .json({ status: 'success', results: reviews.length, data: { reviews } });
});
const getReviewById = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return new AppError('No review with that id ', 404);
  }
  res.status(200).json({ status: 'success', data: { review } });
});
const createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);
  res.status(200).json({ status: 'success', data: { review: newReview } });
});
const updateReview = catchAsync(async (req, res, next) => {});
const deleteReview = catchAsync(async (req, res, next) => {});
export default {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
