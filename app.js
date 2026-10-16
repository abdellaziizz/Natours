import express from 'express';
import morgan from 'morgan';
import userRouter from './routes/userRoutes.js';
import tourRouter from './routes/tourRoutes.js';
import AppError from './utils/appError.js';
import globalErrorController from './controllers/errorController.js';
import rateLimit from 'express-rate-limit';
const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP',
});
//this will effect all the routes that start with /api, so we can use it for all the api routes
app.use('/api', limiter);
app.use(express.json());
app.use(express.static(`public`));
// mounting the routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('/*splat', (req, res, next) => {
  // const err = new Error();
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError('fail', 404));
});
// app.use(globalErrorController);
export default app;
