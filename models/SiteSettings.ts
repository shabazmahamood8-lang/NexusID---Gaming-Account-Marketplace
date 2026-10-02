import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISiteSettings extends Document {
  siteName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  whatsappNumber: string;
  facebookUrl: string;
  discordUrl: string;
  announcementBanner: {
    enabled: boolean;
    text: string;
    link?: string;
  };
  paymentInstructions: {
    bkash: {
      number: string;
      type: string; // Personal or Merchant
      note: string;
    };
    nagad: {
      number: string;
      type: string;
      note: string;
    };
    stripeNote: string;
    bankTransfer: {
      bankName: string;
      accountName: string;
      accountNumber: string;
      branch: string;
    };
  };
  currency: string;
  currencySymbol: string;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteName: { type: String, default: 'NexusID' },
    tagline: { type: String, default: 'Premium Gaming ID Marketplace' },
    supportEmail: { type: String, default: 'support@nexusid.store' },
    supportPhone: { type: String, default: '+880 1700-000000' },
    whatsappNumber: { type: String, default: '+880 1700-000000' },
    facebookUrl: { type: String, default: 'https://facebook.com/nexusid' },
    discordUrl: { type: String, default: 'https://discord.gg/nexusid' },
    announcementBanner: {
      enabled: { type: Boolean, default: true },
      text: { type: String, default: '🔥 Winter Sale: Up to 40% OFF on verified PUBG & Valorant IDs!' },
      link: { type: String, default: '/ids' },
    },
    paymentInstructions: {
      bkash: {
        number: { type: String, default: '01712345678' },
        type: { type: String, default: 'Personal (Send Money)' },
        note: { type: String, default: 'Please send money and provide Transaction ID & your phone number in the order note.' },
      },
      nagad: {
        number: { type: String, default: '01812345678' },
        type: { type: String, default: 'Personal (Send Money)' },
        note: { type: String, default: 'Send money to our official Nagad number and enter your TrxID below.' },
      },
      stripeNote: {
        type: String,
        default: 'International card payments (Visa, MasterCard, Amex) supported via Stripe secure checkout.',
      },
      bankTransfer: {
        bankName: { type: String, default: 'Standard Chartered Bank' },
        accountName: { type: String, default: 'NexusID Tech Global' },
        accountNumber: { type: String, default: '01-1234567-01' },
        branch: { type: String, default: 'Gulshan Branch' },
      },
    },
    currency: { type: String, default: 'BDT' },
    currencySymbol: { type: String, default: '৳' },
  },
  {
    timestamps: true,
  }
);

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
export default SiteSettings;
