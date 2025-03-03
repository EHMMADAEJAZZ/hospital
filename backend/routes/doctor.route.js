import { Router } from "express";
import { cancelAppointment, checkAuth, completeAppointment, forgetPassword, getAllDoctors, getDoctorAppointments, getDoctorDashboardData, getDoctorProfile, login, logOut, registerDoctor, resetPassword, updateDoctorProfile, verfyEmail } from '../controllers/doctor.controller.js';
import { doctorProtectedRoute } from '../middlewares/auth.middleware.js';
import restrictedTo from '../middlewares/restrictedTo.js';
import restricted from "../middlewares/restrictedToDoctor.js";
const doctorRoutes = Router();

doctorRoutes
.post("/add",registerDoctor);
doctorRoutes
.get("/",getAllDoctors)
doctorRoutes.get('/check-auth', doctorProtectedRoute, checkAuth);
doctorRoutes.route('/verify-email').post(verfyEmail);
doctorRoutes.route('/login').post(login);
doctorRoutes.route('/logout').post(doctorProtectedRoute, logOut);
doctorRoutes.route('/doctor/forget-password').post(forgetPassword);
doctorRoutes.route('/doctor/reset-password/:resetToken').post(resetPassword);
doctorRoutes.route("/appointments").get(doctorProtectedRoute,restricted("doctor"),getDoctorAppointments);
doctorRoutes.route("/complete-appointment/:appointmentId").put(doctorProtectedRoute,restricted("doctor"),completeAppointment);
doctorRoutes.route("/cancel-appointment/:appointmentId").put(doctorProtectedRoute,restricted("doctor"),cancelAppointment);
doctorRoutes.route("/dashboard").get(doctorProtectedRoute,restricted("doctor"),getDoctorDashboardData);
doctorRoutes.route("/profile").get(doctorProtectedRoute,restricted("doctor"),getDoctorProfile);
doctorRoutes.route("/edit-profile").put(doctorProtectedRoute,restricted("doctor"),updateDoctorProfile);


export default doctorRoutes;