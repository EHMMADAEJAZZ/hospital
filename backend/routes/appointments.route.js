import express from 'express';
import {
  cancelAppointment,
  getAllAppointments,
  getDoctorAppointments,
  getUserAppointments,
  newAppointment,
  paymentRazorpay,
  verifyRazorPayment,
} from '../controllers/appointment.controller.js';
import { protectedRoute } from '../middlewares/auth.middleware.js';
import restrictedTo from '../middlewares/restrictedTo.js';

const router = express.Router();

// appointment routes
router.route('/:doctorId').post(protectedRoute, newAppointment);
router
  .route('/appointments')
  .get(protectedRoute, restrictedTo('admin', 'patient'), getUserAppointments);
router
  .route('/doctor/:doctorId')
  .get(protectedRoute, restrictedTo('doctor', 'admin'), getDoctorAppointments);
router
  .route('/')
  .get(protectedRoute, restrictedTo('admin'), getAllAppointments);

  router
  .route('/cancelappointment/:appointmentId')
  .post(protectedRoute,restrictedTo("admin",'doctor','patient'),cancelAppointment)
router
.route("/razorpay-payment/:appointmentId")
.post(protectedRoute, restrictedTo('patient', 'admin','doctor'),paymentRazorpay)
router
.patch("/verify-razorpay-payment",protectedRoute,verifyRazorPayment)
export default router;
