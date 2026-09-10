import fs from 'fs';
import express from 'express';
import morgan from 'morgan';
import userRouter from './routes/userRoutes.js';
import tourRouter from './routes/tourRoutes.js';

const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`public`));
// mounting the routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
export default app;
