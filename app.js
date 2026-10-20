import express from 'express';
import morgan from 'morgan';
import userRouter from './routes/userRoutes.js';
import tourRouter from './routes/tourRoutes.js';
import AppError from './utils/appError.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from '@exortek/express-mongo-sanitize';
import hpp from 'hpp';
import env from 'dotenv';
import reviewRouter from './routes/reviewRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
env.config({ path: './config.env' });
const app = express();
app.use(helmet());
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//server static files
app.use(express.static(path.join(__dirname, 'public')));
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
// mounting the routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.get('/', (req, res) => {
  res.status(200).render('base');
});
app.all('/*splat', (req, res, next) => {
  next(new AppError('fail', 404));
});
// app.use(globalErrorController);
export default app;
