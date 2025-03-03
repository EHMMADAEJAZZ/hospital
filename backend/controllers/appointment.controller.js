import Appointment from '../models/appointment.model.js';
import Doctor from '../models/doctor.model.js';
import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import sendEmail from '../utils/sendEmail.js';
import { NEW_APPOINTMENT_EMAIL_TEMPLATE } from '../utils/emailTemplates.js';
import { createOrder, verifyPayment } from '../config/razorPay.js';

export const newAppointment = async (req, res, next) => {
  const { appointmentDate, appointmentTime } = req.body;
  const patientId = req.user._id;
  const { doctorId } = req.params;
  try {
    //find user by patiendId
    const patient = await User.findById(patientId);
    if (!patient) {
      return next(new ApiError(404, 'Patient not found'));
    }
    //find doctor by doctorId
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return next(new ApiError(404, 'Doctor not found'));
    }
    //check if patient is already booked on the same day and time
    const isBooked = await Appointment.findOne({
      doctor: doctorId,
      patient:patientId,
      appointmentDate,
      appointmentTime,
    });
    if (isBooked && isBooked.status !=='Cancelled') {
      return next(
        new ApiError(400, 'you have already booked an appointment with the doctor on same time')
      );
    }
  let slots_booked = doctor.slot_booked;
  if(slots_booked[appointmentDate]){
    if(slots_booked[appointmentDate].includes(appointmentTime)){
      return next(
        new ApiError(400, 'Slot is already booked for this doctor on this date and time')
      );
    }else{
      slots_booked[appointmentDate].push(appointmentTime);
    }
  }else{
    slots_booked[appointmentDate] = [];
    slots_booked[appointmentDate].push(appointmentTime);
  }
  delete doctor.slots_booked;
    

    //create new appointment
    const appointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      appointmentDate,
      appointmentTime,
      amount:doctor.fees
    });
    await appointment.save();
    //update user and doctor appointments accordingly
    patient.appointments.push(appointment._id);
    await patient.save();
    await Doctor.findByIdAndUpdate(doctorId,{
      slot_booked:slots_booked,
      $push: {
        appointments: appointment._id,
      }
    })

    //send email to patient and doctor
    // await sendEmail(
    //   patient.email,
    //   'Appointment confirmation',
    //   NEW_APPOINTMENT_EMAIL_TEMPLATE.replace('{patientName}', patient.name)
    //     .replace('{doctorName}', doctor.name)
    //     .replace('{appointmentDate}', appointmentDate)
    //     .replace('{appointmentTime}', appointmentTime)
    // );
    // await sendEmail(
    //   doctor.email,
    //   'New appointment request',
    //   NEW_APPOINTMENT_EMAIL_TEMPLATE.replace('{patientName}', patient.name)
    //     .replace('{doctorName}', doctor.fullName)
    //     .replace('{appointmentDate}', appointmentDate)
    //     .replace('{appointmentTime}', appointmentTime)
    // );
    return res
      .status(201)
      .json(
        new ApiResponse(201, 'Appointment created successfully', appointment)
      );
  } catch (error) {
     next(error);
  }
};

export const getUserAppointments = async (req, res, next) => {
  try {
    const  patientId  = req.user._id;
    // find all user appointment with doctors
    const userAppointments = await Appointment.find({
      patient: patientId,
    }).populate({
      path: 'doctor',
      select:
        '-_id -__v -appointments  -password -slot_booked -lastLogin -createdAt -updatedAt -role -refreshToken',
    });

    if (!userAppointments.length) {
      return res
        .status(200)
        .json(new ApiResponse(200, 'No Appointments Yet', null));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          'Appointments fetched Successfully',
          userAppointments
        )
      );
  } catch (error) {
    next(error);
  }
};

export const getDoctorAppointments = async (req, res, next) => {
  try {
    const { doctorId } = req.params;

    //find all doctor appointments
    const allDoctorAppointments = await Appointment.find({
      doctor: doctorId,
    }).populate({
      path: 'patient',
      select:
        '-_id -__v -appointments -address -password -slot_booked -lastLogin -createdAt -updatedAt -role -refreshToken',
    });

    if (!allDoctorAppointments.length) {
      return res
        .status(200)
        .json(new ApiResponse(200, 'No Appointments Yet', null));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          'Appointments fetched Successfully',
          allDoctorAppointments
        )
      );
  } catch (error) {
     next(error);
  }
};

// get All Appointments
export const getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({});
    if (!appointments.length) {
      return res
        .status(200)
        .json(new ApiResponse(200, 'No AppointMents Yet', null));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, 'Appointments fetched Successfully', appointments)
      );
  } catch (error) {
     next(error);
  }
};

//cancel appointment request

export const cancelAppointment = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return next(new ApiError(404, 'Appointment not found'));
    }
    if (appointment.patient.toString() !== req.user._id.toString() ) {
      return next(
        new ApiError(403, 'You are not authorized to cancel this appointment')
      );
    }
    appointment.status = 'Cancelled';
    await appointment.save();
 const {doctor,
      appointmentDate,
      appointmentTime,} = appointment;
   
    
    const doc = await Doctor.findById(doctor);
    
    let booked_slots=doc.slot_booked
    booked_slots[appointmentDate] = doc.slot_booked[appointmentDate].filter(
      (app) => app !== appointmentTime
    );

    await Doctor.findByIdAndUpdate(doctor, {
      slot_booked: booked_slots,
    })

    return res
      .status(200)
      .json(
        new ApiResponse(200, 'Appointment canceled successfully', appointment)
      );
  } catch (error) {
     next(error);
  }
};

//razorpay payment

export const paymentRazorpay = async (req, res, next) => {
  try {
    const {appointmentId} = req.params;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment || appointment.status==="Cancelled") {
      return next(new ApiError(404, 'Appointment not found or cancelled'));
    }
    const options={
      amount: appointment.amount * 100,
      currency: process.env.RAZORPAY_CURRENCY,
      receipt: appointmentId,
      payment_capture: 1,
    }
    const order = await createOrder(options);
   
    return res
     .status(200)
     .json(
        new ApiResponse(200, 'Payment Successful', order)
      );

  } catch (error) {
    next(error);
    
  }
}

//verify pament
export const verifyRazorPayment =async(req,res,next)=>{
  const {razorpay_order_id} = req.body;
  try {
    if(!razorpay_order_id){
      return next(new ApiError(400, 'Invalid Order Id'));
    }
    const orderinfo = await verifyPayment(razorpay_order_id);
    if(orderinfo.status==='paid'){
      const appointment = await Appointment.findByIdAndUpdate(orderinfo.receipt,{
        payment:true,
      });
      return res
     .status(200)
     .json(
        new ApiResponse(200, 'Payment Successful', appointment)
      );
    }else{
      return next(new ApiError(400, 'Payment Failed'));
    }
  } catch (error) {
    next(error);
    
  }
}

