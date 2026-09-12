import Tour from '../models/tourModels.js';
import APIFeatures from '../utils/APIFeature.js';

//middleware
const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary';
  next();
};
const getAllTours = async (req, res) => {
  try {
    //Execute Query
    const feature = new APIFeatures(Tour.find(), req.query);
    feature.filter().sorting().limitFields().paginate();
    const tours = await feature.query();

    res
      .status(200)
      .json({ stats: 'success', results: tours.length, data: { tours } });
  } catch (err) {
    res.status(400).json({ stats: 'fail', message: err.message });
  }
};

const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({ stats: 'success', data: { tour } });
  } catch (err) {
    res.status(400).json({ stats: 'fail', message: err.message });
  }
};
const updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ stats: 'success', data: { tour: updatedTour } });
  } catch (err) {
    res.status(400).json({ stats: 'fail', message: err.message });
  }
};

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(400).json({ stats: 'fail', message: err.message });
  }
};
const postTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(200).json({ stats: 'success', data: { newTour } });
  } catch (err) {
    res.status(400).json({ stats: 'fail', data: { message: err.message } });
  }
};
export default {
  getAllTours,
  postTour,
  getTourById,
  deleteTour,
  updateTour,
  aliasTopTours,
};
