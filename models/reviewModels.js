///review \rating \ createdAt\ ref to tour and user

import mongoose from 'mongoose';
const reviewSchema = new mongoose.Schema(
  {
    review: { type: String, required: [true, 'review must have review'] },

    rating: {
      type: Number,
      required: [true, 'review must have rating'],
      min: 1,
      max: 5,
    },
    createdAt: { type: Date, default: Date().now, select: false },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'review must belong to tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'review must belong to user'],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);
const Review = mongoose.model('Review', reviewSchema);
export default Review;
