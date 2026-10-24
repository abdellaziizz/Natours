import mongoose from 'mongoose';
const tourSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Tour must have name'], trim: true },
    duration: { type: Number, required: [true, 'tour must have duration'] },
    maxGroupSize: {
      type: Number,
      required: [true, 'tour must have Group Size'],
    },
    difficulty: { type: String, required: [true, 'tour must have difficulty'] },

    ratingAverage: {
      type: Number,
      default: 4.5,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    slug: {
      type: String,
      required: true,
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
    startLocation: {
      type: { type: String, default: 'Point' },
      coordinates: [Number], //array of numbers is the longitued and latitude
      enum: ['Point'],
      address: String,
      description: String,
    },
    locations: [
      {
        type: { type: String, default: 'Point', enum: ['Point'] },
        address: String,
        description: String,
        coordinates: [Number],
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    description: { type: String, trim: true },
    imageCover: { type: String, required: [true, 'a tour must have image'] },
    images: [String],
    createdAt: { type: Date, default: Date().now, select: false },
    startDates: [Date],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);
tourSchema.virtual('durationOnWeeks').get(function () {
  return this.duration / 7;
});
//reviews is the name of virtual field. foreignField is the name of the field in the review model that references the tour model. localField is the name of the field in the tour model that is being referenced by the foreignField in the review model.
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

tourSchema.pre('validate', function () {
  if (!this.slug) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }
});
const Tour = mongoose.model('Tour', tourSchema);
export default Tour;
