import express from 'express';
import Tours from '../controllers/tourController.js';
import tourController from '../controllers/tourController.js';
const router = express.Router();

router.route('/').get(Tours.getAllTours).post(Tours.postTour);
router
  .route('/top-five-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tours-stats').get(tourController.getToursStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
router.route('/:id').get(Tours.getTourById).delete(Tours.deleteTour);

export default router;
