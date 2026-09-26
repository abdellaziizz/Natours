import express from 'express';
import Users from '../controllers/usersController.js';
import authController from './../controllers/authController.js';
const router = express.Router();
router.post('/signup', authController);
router.route('/').get(Users.getAllUsers).post(Users.postUsers);
router
  .route('/:id')
  .get(Users.getUsersById)
  .put(Users.updateUser)
  .delete(Users.deleteUser);
export default router;
