import Doctor from '../models/doctor.model.js';
import User from '../models/user.model.js';
import ApiError from './apiError.js';

export const generateAccessAndRefreshToken = async (userId, res) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    res.cookie('accessToken', accessToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV !== 'development',
    });
    res.cookie('refreshToken', refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV !== 'development',
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, 'something went wrong while generating token');
  }
};
export const generateAccessAndRefreshTokenDoctor = async (userId, res) => {
  try {
    const user = await Doctor.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    res.cookie('accessTokend', accessToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV !== 'development',
    });
    res.cookie('refreshTokend', refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV !== 'development',
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, 'something went wrong while generating token');
  }
};
export const generateAccessAndRefreshTokenAdmin = async (userId, res) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    res.cookie('accessTokend', accessToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV !== 'development',
    });
    res.cookie('refreshTokend', refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV !== 'development',
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, 'something went wrong while generating token');
  }
};
