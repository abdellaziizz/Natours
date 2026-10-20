import express from 'express';
import Reviews from '../controllers/reviewController.js';
import authController from './../controllers/authController.js';
const router = express.Router({ mergeParams: true });
router.use(authController.protect);
router
  .route('/')
  .get(Reviews.getAllReviews)
  .post(
    authController.authorize('user'),
    Reviews.setTourUserIds,
    Reviews.createReview,
  );
router
  .route('/:id')
  .get(Reviews.getReviewById)
  .patch(authController.authorize('user', 'admin'), Reviews.updateReview)
  .delete(authController.authorize('user', 'admin'), Reviews.deleteReview)
  .get(Reviews.getReviewById);

export default router;
