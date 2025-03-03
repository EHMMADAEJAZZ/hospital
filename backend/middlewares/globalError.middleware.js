import ApiError from '../utils/apiError.js';

const gloalErrorMiddleware = (err, req, res, next) => {
   err.statusCode = err.statusCode || 500;
  err.message = err.message || 'internal server error';
  if (err.name === 'castError') {
    const message = `Invalid ${err.path}: ${err.value}`;
    err =new ApiError(400,message);
  }
  if (err.name === 'ValidationError') {
    const message =  Object.values(err.errors).map(err=>err.message).join(',')
    err = new ApiError(400,message);
  }
  if (err.name === 'JsonWebTokenError') {
   err = new ApiError('Invalid token', 401)
  }
  if (err.name === 'TokenExpiredError') {
   err= new ApiError(401,'Token expired')
  }

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
  err =  new ApiError(400,message);
  }
  res.status(err.statusCode).json({
        status:err.statusCode,
        success:err.success,
        message:err.message,
        errors:err,
        stack:process.env.NODE_ENV === 'development'?err.stack:null,
  });
};

export default gloalErrorMiddleware;
