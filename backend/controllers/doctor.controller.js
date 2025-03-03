import Doctor from '../models/doctor.model.js';
import Appointment from '../models/appointment.model.js';
import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import { deleteOnCloudinary } from '../utils/cloudinary.js';
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from '../utils/emailTemplates.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';
import { generateAccessAndRefreshTokenDoctor } from '../utils/generateToken.js';

export const registerDoctor = async (req, res, next) => {
  console.log(req.user.role);
  const {
    name,
    email,
    phone,
    password,
    gender,
    speciality,
    degree,
    experience,
    about,
    fees,
    address,
    image,
    dob,
    bloodType,
  } = req.body;
  try {
    // console.log(req.body);
    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !gender ||
      !fees ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !address ||
      !image ||
      !dob ||
      !bloodType
    ) {
      return next(new ApiError(400, 'All fields are required'));
    }

    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    const validateEmail =
      /^[A-Za-z]{1,}[A_Za-z_.0-9]{3,}@[A-Za-z]{3,}[.]{1}[A-Za-z.]{2,6}$/;
    if (!phoneRegex.test(phone))
      return next(new ApiError(400, 'please provide a valid phone number'));
    if (!validateEmail.test(email)) {
      return next(new ApiError(400, 'please enter a valid Email'));
    }
    const existedUser = await Doctor.findOne({ email });
    if (existedUser) {
      return next(
        new ApiError(400, 'Doctor already exists with the same email')
      );
    }

    const verficationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const doctor = new Doctor({
      name,
      email,
      password,
      phone,
      dob,
      address: JSON.parse(address),
      gender,
      image,
      speciality,
      degree,
      bloodType,
      experience,
      about,
      fees,
      role: 'doctor',
      verficationToken,
      verficationTokenExpireAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await doctor.save();
    // if (doctor._id) {
    //   await sendEmail(
    //     doctor.email,
    //     'REGISTRATION SUCCESSFUL',
    //     VERIFICATION_EMAIL_TEMPLATE.replace(
    //       '{verificationCode}',
    //       `${verficationToken} WEL COME YOUR ACCOUNT HAS BEEN CREATED NOW YOU ARE THE REGISTERED DOCTPR OF OUR HOSPITAL`
    //     )
    //   );
    // }
    return res.status(201).json(
      new ApiResponse(201, 'Doctor added successfully', {
        doctor,
      })
    );
  } catch (error) {
    await deleteOnCloudinary(image);
    return next(error);
  }
};
export const verfyEmail = async (req, res, next) => {
  const { code } = req.body;
  console.log(code);
  if (!code) {
    return next(new ApiError(400, 'Please enter a valid code'));
  }
  try {
    const doctor = await Doctor.findOne({
      verficationToken: code,
      verficationTokenExpireAt: { $gt: Date.now() },
    });
    if (!doctor) {
      return next(new ApiError(400, 'code invalid or Expired'));
    }
    doctor.isVerified = true;
    doctor.verficationToken = undefined;
    doctor.verficationTokenExpireAt = undefined;
    await doctor.save();
    //send welcome mail
    await sendEmail(
      doctor.email,
      'Welcome ',
      WELCOME_EMAIL_TEMPLATE.replace('{username}', doctor.name)
    );
    //send response

    return res
      .status(200)
      .json(new ApiResponse(200, 'Email verified successfully Please Login'));
  } catch (error) {
    next(error);
  }
};
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return next(new ApiError(400, 'All fields are required'));
    }
    const doctor = await Doctor.findOne({ email });
    if (!doctor || !(await doctor.comparePassword(password))) {
      return next(new ApiError(400, 'invalid Email or password'));
    }
    if (!doctor.isVerified) {
      return next(
        new ApiError(400, 'Email Not Verified please verify your email')
      );
    }
    const { accessToken, refreshToken } =
      await generateAccessAndRefreshTokenDoctor(doctor._id, res);

    doctor.lastLogin = new Date();
    await doctor.save();
    return res.status(200).json(
      new ApiResponse(200, 'LogedIn successfully', {
        accesstoken: accessToken,
        refreshToken: refreshToken,
        ...doctor._doc,
        password: undefined,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const logOut = async (req, res, next) => {
  try {
    return res
      .status(200)
      .clearCookie('accessTokend')
      .clearCookie('refreshTokend')
      .json(new ApiResponse(200, 'Logout successfully'));
  } catch (error) {
    return next(error);
  }
};

export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const doctor = await Doctor.findOne({ email });
    if (!doctor || !doctor.isVerified) {
      return next(new ApiError(400, 'user not found or email not verified'));
    }

    const resetToken = doctor.createResetToken();
    await doctor.save({ validateBeforeSave: false });
    console.log(resetToken);
    const resetURL = `${process.env.FORNTEND_URL}/doctor/forget-password/${resetToken}`;
    await sendEmail(
      doctor.email,
      'Password Reset Url',
      PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetURL)
    );
    res
      .status(200)
      .json(new ApiResponse(200, 'Email sended successfully', resetURL));
  } catch (error) {
    return next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const { resetToken } = req.params;
  const { password, confirmPassword } = req.body;
  if (!password || !confirmPassword) {
    return next(new ApiError(400, 'password and confirmPassword are required'));
  }
  if (password !== confirmPassword) {
    return next(
      new ApiError(400, 'password and confirmPassword does not matches')
    );
  }
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    console.log(resetToken);
    console.log(hashedToken);
    const doctor = await Doctor.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpireAt: { $gt: Date.now() },
    });
    if (!doctor) {
      return next(new ApiError(400, 'reset link expired or invalid token'));
    }
    doctor.password = password;
    doctor.resetPasswordToken = undefined;
    doctor.resetPasswordTokenExpireAt = undefined;
    await doctor.save();
    await sendEmail(
      doctor.email,
      'Password reset successfully',
      PASSWORD_RESET_SUCCESS_TEMPLATE.replace()
    );
    res
      .status(200)
      .json(new ApiResponse(200, 'password reseted succcessfully'));
  } catch (error) {
    return next(error);
  }
};

export const checkAuth = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.doctor._id);
    if (!doctor) {
      return next(new ApiError(400, 'doctor not found'));
    }

    return res.status(200).json(
      new ApiResponse(200, 'ok')
    );
  } catch (error) {
    return next(error);
  }
};

//change availability
export const changeAvailability = async (req, res, next) => {
  const { doctorId } = req.body;
  try {
    if (!doctorId) {
      return next(new ApiError(400, 'doctorId is required'));
    }
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return next(new ApiError(400, 'doctor not found'));
    }
    await Doctor.findByIdAndUpdate(doctorId, {
      isAvailable: !doctor.isAvailable,
    });
    return res.status(200).json(
      new ApiResponse(200, 'doctor availability changed successfully', {
        doctor,
      })
    );
  } catch (error) {
    return next(error);
  }
};

//getAllDoctors
export const getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find({available:true}).select('-password,-email');
    if (!doctors) {
      return next(new ApiError(400, 'No doctors found'));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, 'All doctors fetched successfully', doctors));
  } catch (error) {
    return next(error);
  }
};

//getDoctorById
export const getDoctorById = async (req, res, next) => {
  const { doctorId } = req.params;
  try {
    if (!doctorId) {
      return next(new ApiError(400, 'doctorId is required'));
    }
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return next(new ApiError(400, 'doctor not found'));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, 'doctor fetched successfully', doctor));
  } catch (error) {
    return next(error);
  }
};
//get doctor appointments
export const getDoctorAppointments = async (req, res, next) => {
  const doctorId = req.doctor._id;
  try {
    if (!doctorId) {
      return next(new ApiError(400, 'doctorId is required'));
    }
    const appointments = await Appointment.find({ doctor: doctorId }).populate({
      path: 'patient',
      select:
        '-_id -__v -appointments  -password -address -lastLogin -createdAt -updatedAt -role -refreshToken',
    });
    if (!appointments) {
      return next(new ApiError(400, 'No appointments found'));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          'doctor appointments fetched successfully',
          appointments
        )
      );
  } catch (error) {
    return next(error);
  }
};
//get doctor patients
export const getPatients = async (req, res, next) => {
  const { doctorId } = req.params;
  try {
    if (!doctorId) {
      return next(new ApiError(400, 'doctorId is required'));
    }
    const patients = await Doctor.find({});
    if (!patients) {
      return next(new ApiError(400, 'No patients found'));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, 'doctor patients fetched successfully', patients)
      );
  } catch (error) {
    return next(error);
  }
};

//cancel appointment
export const cancelAppointment = async (req, res, next) => {
  const { appointmentId } = req.params;
  try {
    if (!appointmentId) {
      return next(new ApiError(400, 'appointmentId is required'));
    }
    const appointment = await Appointment.findById(appointmentId);
    console.log(req.doctor._id.toString() === appointment.doctor.toString());
    if (!appointment) {
      return next(new ApiError(400, 'appointment not found'));
    }
    if (appointment.doctor.toString() !== req.doctor._id.toString()) {
      return next(
        new ApiError(403, 'you are not authorized to cancel this appointment')
      );
    }
    appointment.status = 'Cancelled';
    await appointment.save();
    return res
      .status(200)
      .json(new ApiResponse(200, 'appointment canceled successfully'));
  } catch (error) {
    return next(error);
  }
};
//complete appointment
export const completeAppointment = async (req, res, next) => {
  const { appointmentId } = req.params;
  console.log(appointmentId);
  try {
    if (!appointmentId) {
      return next(new ApiError(400, 'appointmentId is required'));
    }
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return next(new ApiError(400, 'appointment not found'));
    }
    if (appointment.doctor.toString() !== req.doctor._id.toString()) {
      return next(
        new ApiError(403, 'you are not authorized to complete this appointment')
      );
    }
    appointment.isCompleted = true;
    appointment.payment=true;
    await appointment.save();
    return res
      .status(200)
      .json(new ApiResponse(200, 'appointment completed successfully'));
  } catch (error) {
    return next(error);
  }
};

//doctor dashboard data
export const getDoctorDashboardData = async (req, res, next) => {
  const doctorId = req.doctor._id;
  try {
    if (!doctorId) {
      return next(new ApiError(400, 'doctorId is required'));
    }
    const [appointments, totalAppointments] = await Promise.all([
      Appointment.find({
        doctor: doctorId,
      }),
      Appointment.countDocuments({ doctor: doctorId }),
    ]);
    let totalEarning = 0;
    appointments.map((item) => {
      if (item.payment || item.isCompleted) {
        totalEarning += item.amount;
      }
    });
    let totalPatients = [];
    appointments.map((item) => {
      if (!totalPatients.includes(item?.patient.toString())) {
        totalPatients.push(item?.patient.toString());
      }
    });

    const completedAppointments = await Appointment.countDocuments({
      doctor: doctorId,
      isCompleted: true,
    });
    const upcomingAppointments = await Appointment.find({
      doctor: doctorId,
      isCompleted: false,
    }).countDocuments();
    const latestAppointments = await Appointment.find({
      doctor: doctorId,
    }).populate({
      path: 'patient',
      select:
        '-_id -__v -appointments  -password -address -lastLogin -createdAt -updatedAt -role -refreshToken',
    });
    return res.status(200).json(
      new ApiResponse(200, 'doctor dashboard data fetched successfully', {
        totalAppointments,
        totalPatients: totalPatients?.length,
        completedAppointments,
        totalEarning,
        upcomingAppointments,
        latestAppointments: latestAppointments.reverse().slice(0, 5),
      })
    );
  } catch (error) {
    next(error);
  }
};

//get doctor profile
export const getDoctorProfile = async (req, res, next) => {
  const doctorId = req.doctor._id;
  try {
    if (!doctorId) {
      return next(new ApiError(400, 'doctorId is required'));
    }
    const doctor = await Doctor.findById(doctorId).select('-password');
    if (!doctor) {
      return next(new ApiError(400, 'doctor not found'));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, 'doctor profile fetched successfully', doctor)
      );
  } catch (error) {
    return next(error);
  }
};

//update doctor profile
export const updateDoctorProfile = async (req, res, next) => {
  const doctorId = req.doctor._id;
  const {
    name,
    email,
    phone,
    gender,
    speciality,
    degree,
    experience,
    about,
    fees,
    address,
    dob,
    bloodType,
    image,
  } = req.body;
  try {
    if (
      !name ||
      !email ||
      !phone ||
      !gender ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address ||
      !dob ||
      !bloodType ||
      !image
    ) {
      return next(new ApiError(400, 'All fields are required'));
    }
    if (!doctorId) {
      return next(new ApiError(400, 'doctorId is required'));
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(doctorId, {
      name,
      email,
      phone,
      gender,
      speciality,
      degree,
      experience,
      about,
      fees,
      address:JSON.parse(address),
      dob,
      bloodType,
      image,
    }, {
      new: true,
    }).select('-password');
    if (!updatedDoctor) {
      return next(new ApiError(400, 'doctor not found'));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          'doctor profile updated successfully',
          updatedDoctor
        )
      );
  } catch (error) {
    return next(error);
  }
};
