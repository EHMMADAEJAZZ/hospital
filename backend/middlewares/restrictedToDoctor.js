import ApiError from '../utils/apiError.js';

const restricted = (...roles)=>{
    return (req, res, next) => {
        const { doctor } = req;

        if (!doctor ||!roles.includes(doctor.role)) {
             return next(
                    new ApiError(
                      403,
                      'Unauthorized you are not authorized to perform this action'
                    )
                  );
        }

        next();
    };
}

export default restricted;