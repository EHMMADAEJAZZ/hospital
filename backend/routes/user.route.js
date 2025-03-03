import express from 'express';
import { checkAuth, forgetPassword, login, logOut, registerUser, resetPassword, updateUser, verfyEmail } from '../controllers/user.controller.js';
import { protectedRoute } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.route('/register').post( registerUser);
router.get('/check-auth', protectedRoute, checkAuth);
router.route('/verify-email').post(verfyEmail);
router.route('/login').post(login);
router.route('/logout').post(protectedRoute, logOut);
router.route('/forget-password').post(forgetPassword);
router.route('/reset-password/:resetToken').post(resetPassword);
router.route("/profile").put(protectedRoute,updateUser)

export default router;
