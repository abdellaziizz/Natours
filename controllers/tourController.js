import Tour from '../models/tourModels.js';
import APIFeatures from '../utils/APIFeature.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from './../utils/appError.js';
import factory from './handlerFactory.js';
//middleware
const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary';
  next();
};

const getAllTours = factory.getAll(Tour);

const getTourById = factory.getOne(Tour, {
  path: 'guides',
});
const updateTour = factory.updateOne(Tour);

const deleteTour = factory.deleteOne(Tour);
//  catchAsync(async (req, res, next) => {
//   await Tour.findByIdAndDelete(req.params.id);
//   res.status(204).json({ status: 'success', data: null });
// });

const postTour = factory.createOne(Tour);
const getToursStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    { $match: { ratingAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: { toUpper: '$difficulty' },
        numRatings: { $sum: '$strtingRatingQuantity' },
        numTours: { $sum: 1 },
        avgrating: { $avg: '$ratingAverage' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },

        avgPrice: { $avg: '$price' },
      },
    },
    { $sort: { avgPrice: 1 } },
  ]);
  res.status(200).json({ status: 'success', data: { stats } });
});
const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = Number(req.params.year);
  const plan = Tour.aggregate([
    { $unwind: 'startDates' },
    {
      $match: {
        startDate: {
          $gte: new Date(`${year}-1-1`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        //grouping by the month
        _id: { $month: 'startDates' }, //this month operator extract the month from date object that in the startDates
        numTours: { $sum: 1 },
        toursName: { $push: '$name' }, //pushing the documents of the name field in toursName array,
      },
      $addFields: { month: '$_id' },
      $project: { _id: 0 },
    },
  ]);
  res.status(200).json({ status: 'success', data: { plan } });
});
export default {
  getAllTours,
  postTour,
  getTourById,
  deleteTour,
  updateTour,
  aliasTopTours,
  getToursStats,
  getMonthlyPlan,
};
