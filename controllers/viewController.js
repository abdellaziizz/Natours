import catchAsync from '../utils/catchAsync.js';
import Tours from './../models/tourModels.js';
const getOverview = catchAsync(async (req, res, next) => {
  //1.GET the documents from the collection
  const tours = await Tours.find();
  res.status(200).render('overview', { title: 'All Tours', tours });
});
const getTours = (req, res) => {
  res.status(200).render('tour', { title: 'The Forest Hiker Tour' });
};
export default { getOverview, getTours };
