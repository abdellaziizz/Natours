import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import APIFeatures from '../utils/APIFeature.js';
const deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return next(new AppError('No document found with that id', 404));
    res.status(204).json({ status: 'success', data: null });
  });
};
const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: 'success', data: { data: doc } });
  });
const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(200).json({ status: 'success', data: { data: doc } });
  });
const getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;
    if (!doc) {
      return new AppError('No document with that id ', 404);
    }
    res.status(200).json({ status: 'success', data: { doc } });
  });
const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //To allwo for nested GET reviews on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const feature = new APIFeatures(Model.find(), req.query);
    feature.filter().sorting().limitFields().paginate();
    const docs = await feature.query();

    res
      .status(200)
      .json({ stats: 'success', results: docs.length, data: { docs } });
  });
export default { deleteOne, updateOne, createOne, getOne, getAll };
