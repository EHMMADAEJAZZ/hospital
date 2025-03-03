import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
const validateEmail =
  /^[A-Za-z]{1,}[A_Za-z_.0-9]{3,}@[A-Za-z]{3,}[.]{1}[A-Za-z.]{2,6}$/;
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      requireed: [true, 'name is required'],
      minlength: [2, 'name must be atleast 2 characters long'],
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: function (v) {
          return validateEmail.test(v);
        },
        message: props => `${props.value} please enter a valid email!`
      },
      requireed: [true, 'email is required'],
      lowercase: true,
    },
    password: {
      type: String,
      requireed: [true, 'password is required'],
      minlength: [6, 'password must be atleast 6 characters long'],
    },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return /^\+?\d{1,15}$/.test(v);
        },
       message: props => `${props.value} is not a valid phone number!`
      },
    },
    dob: {
      type: Date,
      default: new Date(2000, 1, 1)
    },
    gender: {
      type: String,
      lowercase: true,
      enum:{ values:['male', 'female', 'other','not selected'], message: '{VALUE} is not supported'},
      default:'not selected',
    },
    bloodType: {
      type: String,
      lowercase: true,
      trim: true,
      enum: ['a+', 'a-', 'b+', 'b-', 'ab+', 'ab-', 'o+', 'o-'],
    },
  
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
      },
    ],
    
    image: {
      type: String,
      default:"",
    },
    address: {
      line1: {
        type: String,
        default:"",
        trim: true,
        maxlength: 100,
      },
      line2: {
        type: String,
        trim: true,
        default:"",
        maxlength: 100,
      },
      city: {
        type: String,
        default:"",
        trim: true,
        maxlength: 50,
      },
      state: {
        type: String,
        default:"",
        trim: true,
        maxlength: 50,
      },
      pinCode: {
        type: String,
        default:"",
        trim: true,
        maxlength: 6,
      },
    },
    
    
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'patient'],
      default: 'patient',
    },
    passwordChangedAt: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpireAt: Date,
    verficationToken: String,
    verficationTokenExpireAt: Date,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.createResetToken = function () {
  const resetPasswordToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetPasswordToken)
    .digest('hex');
  this.resetPasswordTokenExpireAt = Date.now() + 1 * 60 * 60 * 1000;
  return resetPasswordToken;
};
userSchema.methods.comparePassword = async function (userpassword) {
  return await bcrypt.compare(userpassword, this.password);
};
userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRY,
  });
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRY,
  });
};
const User = mongoose.model('User', userSchema);

export default User;
