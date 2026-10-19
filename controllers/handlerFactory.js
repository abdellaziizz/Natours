import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
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
export default { deleteOne, updateOne };
