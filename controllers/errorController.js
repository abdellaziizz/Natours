import AppError from '../utils/appError.js';
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err).map((el) => {
    el.message;
  });
  const message = `$Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleJWTError = () => {
  return new AppError('Invalid token , please login again', 401);
};
const handleExpiredToken = () => {
  return new AppError('Expired token , please login again', 401);
};
const handleCastErrorDB = (err) => {
  const message = `$Invalid ${err.path}:${err._id}`;
  return new AppError(message, 400);
};
const handleDubErrorDB = (err) => {
  const message = `This Data is already Exist!`;
  return new AppError(message, 400);
};
const sendErrorToDev = (err, req, res) => {
  if (req.orignalUrl.startsWith('/api')) {
    res
      .status(err.statusCode)
      .json({ status: err.status, message: err.message });
  } else {
    res
      .status(err.statusCode)
      .render('error', { title: 'Something Went Wrong !', msg: err.message });
  }
};
const sendErrorToProduction = (err, req, res) => {
  //A)APIs
  if (req.orignalUrl.startsWith('/api')) {
    if (err.isOperational) {
      //optional or trusted err: sending the message to the client
      res
        .status(err.statusCode)
        .json({ status: err.status, message: err.message });
    } else {
      //programming or other unknown error: don't leak the information to the client
      res
        .status(500)
        .json({ status: 'error', message: 'Something went wrong !' });
    }
  } // B) Rendering Website
  else {
    if (err.isOperational) {
      //optional or trusted err: sending the message to the client
      res
        .status(err.statusCode)
        .render('error', { title: 'Something Went Wrong !', msg: err.message });
    } else {
      //programming or other unknown error: don't leak the information to the client
      res.status(err.statusCode).render('error', {
        title: 'Please Try again later ',
        msg: err.message,
      });
    }
  }
};
export default (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    sendErrorToDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (err.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (error.code === 1100) {
      error = handleDubErrorDB(error);
    }
    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }
    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    if (error.name === 'TokenExpiredError') {
      error = handleExpiredToken();
    }
    sendErrorToProduction(error, req, res);
  }
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({ status: err.status, message: err.message });
};
