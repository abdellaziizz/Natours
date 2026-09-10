import express from 'express';
import fs from 'fs';
import Tours from '../controllers/tourController.js';
const router = express.Router();

router.route('/').get(Tours.getAllTours).post(Tours.postTour);

router.route('/:id').get(Tours.getTourById).delete(Tours.deleteTour);
export default router;
