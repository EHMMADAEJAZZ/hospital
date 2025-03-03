import ApiError from '../utils/apiError.js';

const restrictedTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
     
      return next(
        new ApiError(
          403,
          'Unauthorized you are not authorized to perform this action'
        )
      );
    }
    next();
  };
};

export default restrictedTo;
