import mongoose from 'mongoose';
const tourSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Tour must have name'], trim: true },
  duration: { type: Number, required: [true, 'tour must have duration'] },
  maxGroupSize: { type: Number, required: [true, 'tour must have Group Size'] },
  difficulty: { type: String, required: [true, 'tour must have difficulty'] },

  ratingAverage: {
    type: Number,
    default: 4.5,
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'Tour must have price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'Tour must have a Summary'],
  },
  description: { type: String, trim: true },
  imageCover: { type: String, required: [true, 'a tour must have image'] },
  images: [String],
  createdAt: { type: Date, default: Date().now, select: false },
  startDates: [Date],
});
const Tour = mongoose.model('Tour', tourSchema);
export default Tour;
