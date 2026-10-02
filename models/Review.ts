import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  user: mongoose.Types.ObjectId | string;
  userName: string;
  listing: mongoose.Types.ObjectId | string;
  order: mongoose.Types.ObjectId | string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.Mixed, required: true, index: true },
    userName: { type: String, default: 'Customer' },
    listing: { type: Schema.Types.Mixed, required: true, index: true },
    order: { type: Schema.Types.Mixed, required: true, unique: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    isApproved: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

export const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
export default Review;
