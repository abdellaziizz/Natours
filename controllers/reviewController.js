import Review from '../models/reviewModels.js';
import factory from './handlerFactory.js';
const getAllReviews = factory.getAll(Review);
const getReviewById = factory.getOne(Review);
const setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};
const createReview = factory.createOne(Review);
const updateReview = factory.updateOne(Review);
const deleteReview = factory.deleteOne(Review);
export default {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  setTourUserIds,
};
