import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Doctor from '../models/doctor.model.js';
import ApiError from '../utils/apiError.js';

export const protectedRoute = async (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.headers?.authorization?.replace('Bearer ', '');
    if (!token) {
      return next(new ApiError(401, 'unAuthorized'));
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log(decodedToken);
    const user = await User.findById(decodedToken?.id).select('-password');
    if (!user) {
      return next(new ApiError(404, 'user Not Found'));
    }
    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(error.statusCode, error.message));
  }
};



export const doctorProtectedRoute = async (req, res, next) => {
  try {
    const token =
      req.cookies.accessTokend ||
      req.headers?.authorization?.replace('Bearer ', '');
    if (!token) {
      return next(new ApiError(401, 'unAuthorized'));
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log(decodedToken);
    const doctor = await Doctor.findById(decodedToken?.id).select('-password -refreshToken -appointments');
    if (!doctor) {
      return next(new ApiError(404, 'user Not Found'));
    }
    req.doctor = doctor;
    next();
  } catch (error) {
    return next(new ApiError(error.statusCode, error.message));
  }
};
export const adminProtectedRoute = async (req, res, next) => {
  try {
    const token =
      req.cookies.accessTokend ||
      req.headers?.authorization?.replace('Bearer ', '');
    if (!token) {
      return next(new ApiError(401, 'unAuthorized'));
    }
// console.log(token)
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log(decodedToken);
    const user = await User.findById(decodedToken?.id).select('-password -refreshToken -appointments');
    if (!user) {
      return next(new ApiError(404, 'user Not Found'));
    }
    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(error.statusCode, error.message));
  }
};