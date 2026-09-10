import express from 'express';
import Users from '../controllers/usersController.js';
const router = express.Router();

router.route('/').get(Users.getAllUsers).post(Users.postUsers);
router
  .route('/:id')
  .get(Users.getUsersById)
  .put(Users.updateUser)
  .delete(Users.deleteUser);
export default router;
