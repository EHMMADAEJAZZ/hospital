import Doctor from '../models/doctor.model.js';
import AppErrors from './ApiErrors.js';

export const generateAccessAndRefreshToken = async (userId) => {
  try {
    const doctor = await Doctor.findById(userId);
    const accessToken = doctor.generateAccessToken();
    const refreshToken = doctor.generateRefreshToken();
    doctor.refreshToken = refreshToken;
    await doctor.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new AppErrors(500, 'something went wrong while generating token');
  }
};
