import app from './app.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config({ path: './config.env' });
export const getOverview = (req, res) => {
  res.status(200).render('overview', {
    title: 'All Tours',
    mapboxToken: process.env.MAPBOX_TOKEN,
  });
};
const DB = process.env.DATABASE;
mongoose.connect(DB).then((con) => {
  console.log('DB connection Success');
});
app.listen(3000, '127.0.0.1', () => {
  console.log('app is running on port 3000');
});
