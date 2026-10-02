import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IIDListing extends Document {
  title: string;
  game: string;
  platform: string;
  price: number;
  originalPrice: number;
  images: string[];
  description: string;
  level: number | string;
  rank: string;
  region: string;
  features: string[];
  status: 'available' | 'reserved' | 'sold';
  featured: boolean;
  seller: {
    name: string;
    rating: number;
    verified: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const IDListingSchema = new Schema<IIDListing>(
  {
    title: { type: String, required: true, trim: true },
    game: { type: String, required: true, index: true },
    platform: { type: String, required: true, default: 'PC' },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, required: true, min: 0 },
    images: { type: [String], default: [] },
    description: { type: String, required: true },
    level: { type: Schema.Types.Mixed, default: 1 },
    rank: { type: String, required: true },
    region: { type: String, default: 'Global' },
    features: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['available', 'reserved', 'sold'],
      default: 'available',
      index: true,
    },
    featured: { type: Boolean, default: false, index: true },
    seller: {
      name: { type: String, default: 'Nexus Verified Seller' },
      rating: { type: Number, default: 4.9 },
      verified: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

IDListingSchema.index({ title: 'text', description: 'text', game: 'text' });

export const IDListing: Model<IIDListing> = mongoose.models.IDListing || mongoose.model<IIDListing>('IDListing', IDListingSchema);
export default IDListing;
