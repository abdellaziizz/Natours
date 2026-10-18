import express from 'express';
import morgan from 'morgan';
import userRouter from './routes/userRoutes.js';
import tourRouter from './routes/tourRoutes.js';
import AppError from './utils/appError.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import env from 'dotenv';
import reviewRouter from './routes/reviewRoutes.js';

env.config({ path: './config.env' });
const app = express();
app.use(helmet());

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
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whiteList: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);
app.use(express.static(`public`));
// mounting the routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.all('/*splat', (req, res, next) => {
  // const err = new Error();
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError('fail', 404));
});
// app.use(globalErrorController);
export default app;
