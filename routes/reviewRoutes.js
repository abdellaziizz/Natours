import express from 'express';
import Reviews from '../controllers/reviewController.js';
import authController from './../controllers/authController.js';
const router = express.Router({ mergeParams: true });
router
  .route('/')
  .get(Reviews.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    Reviews.createReview,
  );
router
  .route('/:id')
  .get(Reviews.getReview)
  .patch(
    authController.protect,
    authController.restrictTo('user', 'admin'),
    Reviews.updateReview,
  )
  .delete(
    authController.protect,
    authController.restrictTo('user', 'admin'),
    Reviews.deleteReview,
  );

export default router;
