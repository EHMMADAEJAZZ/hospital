import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dbConnect from './config/dbConfig.js';
import gloalErrorMiddleware from './middlewares/globalError.middleware.js';
import ApiError from './utils/apiError.js';
import ApiResponse from './utils/apiResponse.js';
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: [process.env.FORNTEND_URL, process.env.FORNTEND_ADMIN_URL],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
);
app.use(cookieParser());
app.get('/', async (req, res, next) => {
  res
    .status(200)
    .json(new ApiResponse(200, 'hello', { user: 'aijaz', age: 27 }));
});
import userRoute from './routes/user.route.js';
import adminRoute from './routes/admin.route.js';
import appointmentRoute from './routes/appointments.route.js';
import doctorRoute from './routes/doctor.route.js';
app.use('/api/v1/user', userRoute);
app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/appointment', appointmentRoute);
app.use('/api/v1/doctor', doctorRoute);
app.use('*', (req, res, next) => {
  next(new ApiError(404, `NO ROUTE FOUND FOR ${req.originalUrl}`));
});
app.use(gloalErrorMiddleware);
dbConnect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running on PORT! ${PORT}`);
    });
  })
  .catch(() => {
    console.log(`MONGODB CONNECTION FAILED ${error.message}`);
  });
