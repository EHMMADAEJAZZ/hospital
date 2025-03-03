import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE ,WELCOME_EMAIL_TEMPLATE } from '../utils/emailTemplates.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';
import { generateAccessAndRefreshToken } from '../utils/generateToken.js';
export const registerUser = async (req, res, next) => {
  const {
    name,
    email,
    password,
    
  } = req.body;
  if (
    !name ||
    !email ||
    !password 
   
  ) {
    return next(new ApiError(400, 'All fields are required'));
  }
 
  const validateEmail =
    /^[A-Za-z]{1,}[A_Za-z_.0-9]{3,}@[A-Za-z]{3,}[.]{1}[A-Za-z.]{2,6}$/;
  
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
    const user = new User({
      name,
      email,
      password,      
      verficationToken,
      verficationTokenExpireAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    await user.save();
    // if (user._id) {
    //   await sendEmail(
    //     user.email,
    //     'verify your email address',
    //     VERIFICATION_EMAIL_TEMPLATE.replace(
    //       '{verificationCode}',
    //       verficationToken
    //     )
    //   );
    // }
    return res.status(201).json(
      new ApiResponse(201, 'user created successfully', {
        ...user._doc,
        password: undefined,
      })
    );
  } catch (error) {
     next(error);
  }
};


export const verfyEmail = async (req, res, next) => {
  const { code } = req.body;
  console.log(code);
  if (!code) {
    return next(new ApiError(400, 'Please enter a valid code'));
  }
  try {
    const user = await User.findOne({
      verficationToken: code,
      verficationTokenExpireAt: { $gt: Date.now() },
    });
    if (!user) {
      return next(new ApiError(400, 'code invalid or Expired'));
    }
    user.isVerified = true;
    user.verficationToken = undefined;
    user.verficationTokenExpireAt = undefined;
    await user.save();
    //send welcome mail
    await sendEmail(
      user.email,
      'Welcome ',
      WELCOME_EMAIL_TEMPLATE.replace('{username}', user.name)
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
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return next(new ApiError(400, 'invalid Email or password'));
    }
    if (!user.isVerified) {
      return next(
        new ApiError(400, 'Email Not Verified please verify your email')
      );
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
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

export const logOut = async (req, res, next) => {
  try {
    return res
      .status(200)
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .json(new ApiResponse(200, 'Logout successfully'));
  } catch (error) {
     next(error);
  }
};

export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      return next(new ApiError(400, 'user not found or email not verified'));
    }

    const resetToken = user.createResetToken();
    await user.save({ validateBeforeSave: false });
    console.log(resetToken);
    const resetURL = `${process.env.FORNTEND_URL}/forget-password/${resetToken}`;
    await sendEmail(
      user.email,
      'Password Reset Url',
      PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetURL)
    );
    res
      .status(200)
      .json(new ApiResponse(200, 'Email sended successfully', resetURL));
  } catch (error) {
    return next(new ApiError(error.statusCode, error.message));
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
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpireAt: { $gt: Date.now() },
    });
    if (!user) {
      return next(new ApiError(400, 'reset link expired or invalid token'));
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpireAt = undefined;
    await user.save();
     await sendEmail(
      user.email,
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
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new ApiError(400, 'user not found'));
    }

    return res.status(200).json(
      new ApiResponse(200, 'ok', {
        ...user._doc,
        password: undefined,
      })
    );
  } catch (error) {
    return next(new ApiError(error.statusCode, error.message));
  }
};
//update userdetails 
export const updateUser = async (req, res, next) => {
  const { name, email, phone,address,dob,gender,bloodType,image} = req.body;
  if (!name ||!email ||!phone ||!address ||!dob ||!gender ||!bloodType ||!image) {
    return next(new ApiError(400, 'All fields are required'));
  }
const userId = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(userId,{
      $set:{
        name,
        email,
        phone,
        address:JSON.parse(address),
        dob,
        gender,
        bloodType,
        image,
      }
    },{
      new: true,
      runValidators: true,
    })
    if (!user) {
      return next(new ApiError(400, 'user not found'));
    }
    return res.status(200).json(
      new ApiResponse(200, 'user updated successfully', {
        ...user._doc,
        password: undefined,
      })
    );
  } catch (error) {
    return next(error);
  }
};