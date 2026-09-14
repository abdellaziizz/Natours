import Tour from '../models/tourModels.js';
import APIFeatures from '../utils/APIFeature.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../appError.js';
//middleware
const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary';
  next();
};

const getAllTours = catchAsync(async (req, res, next) => {
  //Execute Query
  const feature = new APIFeatures(Tour.find(), req.query);
  feature.filter().sorting().limitFields().paginate();
  const tours = await feature.query();

  res
    .status(200)
    .json({ stats: 'success', results: tours.length, data: { tours } });
});

const getTourById = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return new AppError('No tour with that id ', 404);
  }
  res.status(200).json({ stats: 'success', data: { tour } });
});
const updateTour = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ stats: 'success', data: { tour: updatedTour } });
});

const deleteTour = catchAsync(async (req, res, next) => {
  await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({ status: 'success', data: null });
});

const postTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(200).json({ stats: 'success', data: { newTour } });
});
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
  res.status(200).json({ stats: 'success', data: { stats } });
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
  res.status(200).json({ stats: 'success', data: { plan } });
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
