import express from 'express';
import Users from '../controllers/usersController.js';
import authController from './../controllers/authController.js';
const router = express.Router();
router.post('/signup', authController.signUp);
router.post('/login', authController.logIn);
router.route('/forgotpassword', authController.forgotPassword);
// router.route('/resetpassword', authController.resetPassword);
router.use(authController.protect);
router.get('/me', Users.getMe, Users.getUserById);
router.patch('/updateMe', Users.updateMe);
router.delete('/deleteMe', Users.deleteMe);
router.route('/').get(Users.getAllUsers).post(Users.postUsers);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);

router
  .route('/:id')
  .get(Users.getUsersById)
  .put(Users.updateUser)
  .delete(Users.deleteUser);
export default router;
