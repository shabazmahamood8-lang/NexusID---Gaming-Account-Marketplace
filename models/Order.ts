import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId | string;
  listing: mongoose.Types.ObjectId | string;
  customerName: string;
  email: string;
  phone: string;
  price: number;
  paymentMethod: string;
  paymentTransactionId?: string;
  note?: string;
  status: 'pending' | 'confirmed' | 'paid' | 'delivered' | 'cancelled';
  deliveryDetails?: {
    accountUsername?: string;
    accountPassword?: string;
    backupCodes?: string;
    instructions?: string;
    deliveredAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.Mixed, required: true, index: true },
    listing: { type: Schema.Types.Mixed, required: true, ref: 'IDListing' },
    customerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    paymentMethod: { type: String, required: true, default: 'bkash' },
    paymentTransactionId: { type: String, default: '' },
    note: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'paid', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },
    deliveryDetails: {
      accountUsername: { type: String, default: '' },
      accountPassword: { type: String, default: '' },
      backupCodes: { type: String, default: '' },
      instructions: { type: String, default: '' },
      deliveredAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

export const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export default Order;
