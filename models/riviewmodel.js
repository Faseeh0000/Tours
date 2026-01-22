import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
{
  review: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 4
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
}
);

// One user can review a tour only once
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

export const Review = mongoose.model("Review",reviewSchema);
