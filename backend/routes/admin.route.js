import express from 'express';
import { registerDoctor } from '../controllers/doctor.controller.js';
import restrictedTo from '../middlewares/restrictedTo.js';
import { adminProtectedRoute } from '../middlewares/auth.middleware.js';
import {
  adminDashboardData,
  adminLogin,
  cancelAppointment,
  changeAvailability,
  checkAuth,
  getAllAppointments,
  getAllDoctors,
  getAllUsers,
  logOut,
  registerAdmin,
} from '../controllers/admin.controller.js';

const router = express.Router();

router
  .route('/users')
  .get(adminProtectedRoute, restrictedTo('admin'), getAllUsers);
router
  .route('/admin-registration')
  .post(adminProtectedRoute, restrictedTo('admin'), registerAdmin);
router.route('/check-auth').get(adminProtectedRoute, checkAuth);
router
  .route('/doctor-registration')
  .post(adminProtectedRoute, restrictedTo('admin'), registerDoctor);
router.route('/login').post(adminLogin);
router.route('/logout').post(adminProtectedRoute, logOut);
router
  .route('/all-doctors')
  .get(adminProtectedRoute, restrictedTo('admin'), getAllDoctors);
router
  .route('/doctor/availability')
  .post(adminProtectedRoute, restrictedTo('admin'), changeAvailability);
router
  .route('/appointments')
  .get(adminProtectedRoute, restrictedTo('admin'), getAllAppointments);
router
  .route('/appointment/cancel')
  .post(adminProtectedRoute, restrictedTo('admin'), cancelAppointment);
router
  .route('/dashboard')
  .get(adminProtectedRoute, restrictedTo('admin'), adminDashboardData);
export default router;
