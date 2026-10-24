import express from 'express';
import viewController from './../controllers/viewController.js';
import authController from '../controllers/authController.js';
const router = express.Router();
router.get('/', authController.isLogedIn, viewController.getOverview);
router.get('/tour/:slug', authController.isLogedIn, viewController.getTour);
router.get('/login', authController.isLogedIn, viewController.getLoginForm);
router.get('/me', authController.protect, viewController.getAccount);
export default router;
