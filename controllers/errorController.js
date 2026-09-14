import AppError from '../utils/appError';
handleValidationErrorDB = (err) => {
  const errors = Object.values(err).map((el) => {
    el.message;
  });
  const message = `$Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleCastErrorDB = (err) => {
  const message = `$Invalid ${err.path}:${err._id}`;
  return new AppError(message, 400);
};
const handleDubErrorDB = (err) => {
  const message = `This Data is already Exist!`;
  return new AppError(message, 400);
};
const sendErrorToDev = (err, res) => {
  res.status(err.statusCode).json({ status: err.status, message: err.message });
};
const sendErrorToProduction = (err, res) => {
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
};
export default (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    sendErrorToDev(err, res);
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
    sendErrorToProduction(error);
  }
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({ status: err.status, message: err.message });
};
