import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: 'string',
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: 'string',
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: (v) => /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/i,
        message: 'Please enter a valid email address',
      },
    },
    phone: {
      type: 'string',
      required: true,
      validate: {
        validator: (v) => /^\+?\d{1,15}$/i,
        message: 'Please enter a valid phone number',
      },
    },
    password: {
      type: 'string',
      required: true,
    },
    image: {
      type: 'string',
      required: true,
    },
    gender: {
      type: String,
      lowercase: true,
      enum: {
        values: ['male', 'female', 'other', 'not selected'],
        message: '{VALUE} is not supported',
      },
      default: 'not selected',
    },
    dob: {
      type: Date,
      default: new Date(2000, 1, 1),
    },
    bloodType: {
      type: String,
      lowercase: true,
      trim: true,
      enum: {
        values: [
          'a+',
          'a-',
          'b+',
          'b-',
          'ab+',
          'ab-',
          'o+',
          'o-',
          'not selected',
        ],
        message: '{VALUE} is not supported',
      },
      default: 'not selected',
    },
    speciality: {
      type: 'string',
      required: true,
    },
    degree: {
      type: 'string',
      required: true,
    },
    experience: {
      type: 'string',
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
      },
    ],
    about: {
      type: 'string',
      required: true,
      maxlength: 500,
    },
    fees: {
      type: 'number',
      required: true,
      min: 0,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    address: {
      line1: {
        type: String,
        default: '',
        trim: true,
        maxlength: 100,
      },
      line2: {
        type: String,
        trim: true,
        default: '',
        maxlength: 100,
      },
      city: {
        type: String,
        default: '',
        trim: true,
        maxlength: 50,
      },
      state: {
        type: String,
        default: '',
        trim: true,
        maxlength: 50,
      },
      pinCode: {
        type: String,
        default: '',
        trim: true,
        maxlength: 6,
      },
    },

    lastLogin: {
      type: Date,
      default: Date.now,
    },
    slot_booked: {
      type: Object,
      default: {},
    },
    available: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['doctor'],
      default: 'doctor',
    },
    refreshToken: {
      type: String,
    },
    passwordChangedAt: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpireAt: Date,
    verficationToken: String,
    verficationTokenExpireAt: Date,
  },
  { timestamps: true, minimize: false }
);
doctorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;
  next();
});
doctorSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
doctorSchema.methods.createResetToken = function () {
  const resetPasswordToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetPasswordToken)
    .digest('hex');
  this.resetPasswordTokenExpireAt = Date.now() + 1 * 60 * 60 * 1000;
  return resetPasswordToken;
};
doctorSchema.methods.generateAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRY,
  });
};
doctorSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRY,
  });
};
const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
