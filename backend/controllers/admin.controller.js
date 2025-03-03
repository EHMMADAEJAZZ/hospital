import Doctor from '../models/doctor.model.js';
import User from '../models/user.model.js';
import Appointment from '../models/appointment.model.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import { VERIFICATION_EMAIL_TEMPLATE } from '../utils/emailTemplates.js';
import { generateAccessAndRefreshToken, generateAccessAndRefreshTokenAdmin } from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
//get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const [users, admins, doctors] = await Promise.all([
      User.find({ role: 'user' }),
      User.find({ role: 'admin', _id: { $ne: req.user._id } }),
      Doctor.find({ role: 'doctor' }),
    ]);
    if (!users.length)
      return res.status(200).json(new ApiResponse(200, 'No users found', null));
    return res.status(200).json(
      new ApiResponse(200, 'All users fetched successfully', {
        users,
        admins,
        doctors,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password) {
      return next(new ApiError(400, 'Email and password are required'));
    }
    const user = await User.findOne({ email: req.body.email }).select(
      '+password'
    );
    if (!user || !(await user.comparePassword(req.body.password))) {
      return next(new ApiError(401, 'Invalid email or password'));
    }
    if (user.role !== 'admin') {
      return next(
        new ApiError(401, 'Invalid email or password')
      );
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokenAdmin(
      user._id,
      res
    );
    user.lastLogin = new Date();
    await user.save();
    return res.status(200).json(
      new ApiResponse(200, 'LogedIn successfully', {
        accesstoken: accessToken,
        refreshtoken: refreshToken,
        ...user._doc,
        password: undefined,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const registerAdmin = async (req, res, next) => {
  const {
    name,
    email,
    password,
    phone,
    gender,
    bloodType,
    dob,
    address,
    image,
  } = req.body;
  if (!name || !email || !password) {
    return next(new ApiError(400, 'All fields are required'));
  }
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const validateEmail =
    /^[A-Za-z]{1,}[A_Za-z_.0-9]{3,}@[A-Za-z]{3,}[.]{1}[A-Za-z.]{2,6}$/;
  if (phone && !phoneRegex.test(phone))
    return next(new ApiError(400, 'please provide a valid phone number'));
  if (!validateEmail.test(email)) {
    return next(new ApiError(400, 'please enter a valid Email'));
  }
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    return next(new ApiError(400, 'user already exists'));
  }

  try {
    const verficationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const admin = new User({
      name,
      email,
      password,
      phone,
      address: address && JSON.parse(address),
      bloodType,
      gender,
      dob,
      isVerified: true,
      image,
      role: 'admin',
      verficationToken,
      verficationTokenExpireAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    await admin.save();
    // if (admin._id) {
    //   await sendEmail(
    //     admin.email,
    //     'verify your email address',
    //     VERIFICATION_EMAIL_TEMPLATE.replace(
    //       '{verificationCode}',
    //       verficationToken
    //     )
    //   );
    // }
    return res.status(201).json(
      new ApiResponse(201, 'user created successfully', {
        ...admin._doc,
        password: undefined,
      })
    );
  } catch (error) {
    next(error);
  }
};
//getAllDoctors
export const getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find({});
    return res.status(200).json(new ApiResponse(200, 'Doctors fetched successfully', doctors));
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
      available :!doctor.available,
    });
    return res.status(200).json(
      new ApiResponse(200, 'doctor availability changed successfully')
    );
  } catch (error) {
    return  next(error);
  }
};

// get All Appointments
export const getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({}).populate({
      path: 'doctor',
      select:
        '-_id -__v -appointments  -password -address -slot_booked -lastLogin -createdAt -updatedAt -role -refreshToken',
    }).populate({
      path: 'patient',
      select:
        '-_id -__v -appointments  -password -address -lastLogin -createdAt -updatedAt -role -refreshToken',
    });
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
    const { appointmentId } = req.body;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return next(new ApiError(404, 'Appointment not found'));
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

//admin dashborad data

export const adminDashboardData = async (req, res, next) => {
  try {
    const patientsCount = await User.countDocuments({ role: 'patient' });
    const adminsCount = await User.countDocuments({ role: 'admin' });
    const doctorsCount = await Doctor.countDocuments();
    const appointmentsCount = await Appointment.countDocuments();
    const upcomingAppointments = await Appointment.find({}).populate({
      path: 'doctor',
      select:
        '-_id -__v -appointments  -password -address -slot_booked -lastLogin -createdAt -updatedAt -role -refreshToken',
    });
    return res.status(200).json(
      new ApiResponse(
        200,
        'Admin Dashboard Data fetched successfully',
        {
          patientsCount,
          adminsCount,
          doctorsCount,
          appointmentsCount,
          upcomingAppointments:upcomingAppointments.reverse().slice(0,5),
        }
      )
    );
  } catch (error) {
    next(error);
  }
};
export const logOut = async (req, res, next) => {
  try {
    return res
      .status(200)
      .clearCookie('accessTokend')
      .clearCookie('refreshTokend')
      .json(new ApiResponse(200, 'logout successfully'));
  } catch (error) {
     next(error);
  }
};
export const checkAuth = async (req, res, next) => {
  try {
    const doctor = await User.findById(req.user._id);
    if (!doctor) {
      return next(new ApiError(400, 'Admin not found'));
    }

    return res.status(200).json(
      new ApiResponse(200, 'ok')
    );
  } catch (error) {
    return next(error);
  }
};