import express from 'express';
// import Tours from '../controllers/tourController.js';
import tourController from '../controllers/tourController.js';
import authController from './../controllers/authController.js';
import reviewRouter from './..//routes/reviewRoutes.js';
const router = express.Router();
router.use('/:tourId/reviews', reviewRouter);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.authorize('admin', 'lead-guide'),
    tourController.postTour,
  );
router
  .route('/top-five-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tours-stats').get(tourController.getToursStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.authorize('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan,
  );
router
  .route('/:id')
  .get(tourController.getTourById)
  .delete(
    authController.protect,
    authController.authorize('admin', 'lead-guide'),
    tourController.deleteTour,
  )
  .patch(
    authController.protect,
    authController.authorize('admin', 'lead-guide'),
    tourController.uploadTourImage,
    tourController.resizeTourImage,
    tourController.updateTour,
  );
router.route('/forgotpassword', authController.forgotPassword);
router.route('/resetpassword', authController.resetPassword);

export default router;
