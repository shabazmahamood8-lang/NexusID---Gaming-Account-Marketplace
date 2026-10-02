import { connectToDatabase } from './mongodb.ts';
import { User, IUser } from '../models/User.ts';
import { IDListing, IIDListing } from '../models/IDListing.ts';
import { Order, IOrder } from '../models/Order.ts';
import { Review, IReview } from '../models/Review.ts';
import { Category, ICategory } from '../models/Category.ts';
import { SiteSettings, ISiteSettings } from '../models/SiteSettings.ts';
import { ContactMessage, IContactMessage } from '../models/ContactMessage.ts';
import { sampleListings, initialCategories } from './seed.ts';
import bcrypt from 'bcryptjs';

// In-memory persistent cache for environments before MONGODB_URI is provided
let memUsers: any[] = [];
let memListings: any[] = [];
let memOrders: any[] = [];
let memReviews: any[] = [];
let memCategories: any[] = [];
let memSettings: any = null;
let memMessages: any[] = [];

async function initLocalStore() {
  if (memListings.length === 0) {
    memListings = sampleListings.map((item, idx) => ({
      ...item,
      _id: `listing-${idx + 1}`,
      createdAt: new Date(Date.now() - idx * 86400000),
      updatedAt: new Date(Date.now() - idx * 86400000),
    }));
  }

  if (memCategories.length === 0) {
    memCategories = initialCategories.map((c, idx) => ({
      ...c,
      _id: `cat-${idx + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }

  if (!memSettings) {
    memSettings = {
      _id: 'settings-1',
      siteName: 'NexusID',
      tagline: 'Premium Gaming ID Marketplace',
      supportEmail: 'support@nexusid.store',
      supportPhone: '+880 1700-000000',
      whatsappNumber: '+880 1700-000000',
      facebookUrl: 'https://facebook.com/nexusid',
      discordUrl: 'https://discord.gg/nexusid',
      announcementBanner: {
        enabled: true,
        text: '🔥 Ramadan & Winter Sale: Up to 40% OFF on verified PUBG & Valorant IDs!',
        link: '/ids',
      },
      paymentInstructions: {
        bkash: {
          number: '01712345678',
          type: 'Personal (Send Money)',
          note: 'Please send money and provide Transaction ID & your phone number in the order note.',
        },
        nagad: {
          number: '01812345678',
          type: 'Personal (Send Money)',
          note: 'Send money to our official Nagad number and enter your TrxID below.',
        },
        stripeNote: 'International card payments (Visa, MasterCard, Amex) supported via Stripe secure checkout.',
        bankTransfer: {
          bankName: 'Standard Chartered Bank',
          accountName: 'NexusID Tech Global',
          accountNumber: '01-1234567-01',
          branch: 'Gulshan Branch',
        },
      },
      currency: 'BDT',
      currencySymbol: '৳',
      updatedAt: new Date(),
    };
  }

  if (memUsers.length === 0) {
    const adminPass = await bcrypt.hash('admin123456', 10);
    const customerPass = await bcrypt.hash('customer123456', 10);
    memUsers = [
      {
        _id: 'user-admin',
        name: 'Super Admin',
        email: 'admin@nexusid.store',
        password: adminPass,
        role: 'admin',
        phone: '+880 1711-223344',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'user-customer',
        name: 'Rahim Ahmed',
        email: 'customer@nexusid.store',
        password: customerPass,
        role: 'customer',
        phone: '+880 1811-556677',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  if (memOrders.length === 0) {
    memOrders = [
      {
        _id: 'order-demo-1',
        user: 'user-customer',
        listing: 'listing-6', // Clash of Clans
        customerName: 'Rahim Ahmed',
        email: 'customer@nexusid.store',
        phone: '+880 1811-556677',
        price: 8500,
        paymentMethod: 'bkash',
        paymentTransactionId: '9KL897TRX',
        note: 'Sent via bKash personal. Looking forward to fast delivery!',
        status: 'delivered',
        deliveryDetails: {
          accountUsername: 'coc_master_th16@nexusmail.com',
          accountPassword: 'SecurePassword#2026',
          backupCodes: '8912-4412, 9021-3312',
          instructions: 'Login to Supercell ID with the provided email. Verification code will be sent to the backup email.',
          deliveredAt: new Date(Date.now() - 3600000 * 5),
        },
        createdAt: new Date(Date.now() - 3600000 * 24),
        updatedAt: new Date(Date.now() - 3600000 * 5),
      },
    ];

    memReviews = [
      {
        _id: 'rev-1',
        user: 'user-customer',
        userName: 'Rahim Ahmed',
        listing: 'listing-6',
        order: 'order-demo-1',
        rating: 5,
        comment: 'Super fast delivery! Within 15 minutes of payment confirmation, I received the Supercell ID and full credentials. The TH16 base is exactly as described with max heroes.',
        isApproved: true,
        createdAt: new Date(Date.now() - 3600000 * 4),
      },
    ];
  }
}

// Initialise local cache immediately
initLocalStore();

export const Store = {
  // USERS
  async findUserByEmail(email: string) {
    const { isConnected } = await connectToDatabase();
    if (isConnected) {
      return await User.findOne({ email: email.toLowerCase() }).select('+password').lean();
    }
    await initLocalStore();
    return memUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserById(id: string) {
    const { isConnected } = await connectToDatabase();
    if (isConnected) {
      return await User.findById(id).select('-password').lean();
    }
    await initLocalStore();
    const user = memUsers.find((u) => String(u._id) === String(id));
    if (!user) return null;
    const { password, ...safe } = user;
    return safe;
  },

  async createUser(data: Partial<IUser>) {
    const { isConnected } = await connectToDatabase();
    if (isConnected) {
      const created = await User.create(data);
      return created.toObject();
    }
    await initLocalStore();
    const newUser = {
      ...data,
      _id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      role: data.role || 'customer',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memUsers.push(newUser);
    return newUser;
  },

  async getAllUsers() {
    const { isConnected } = await connectToDatabase();
    if (isConnected) {
      return await User.find().select('-password').sort({ createdAt: -1 }).lean();
    }
    await initLocalStore();
    return memUsers.map(({ password, ...u }) => u);
  },

  async updateUserRole(id: string, role: 'customer' | 'admin') {
    const { isConnected } = await connectToDatabase();
    if (isConnected) {
      return await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password').lean();
    }
    await initLocalStore();
    const user = memUsers.find((u) => String(u._id) === String(id));
    if (user) {
      user.role = role;
      user.updatedAt = new Date();
      return user;
    }
    return null;
  },

  async updateUserProfile(id: string, data: { name?: string; phone?: string; avatar?: string }) {
    const { isConnected } = await connectToDatabase();
    if (isConnected) {
      return await User.findByIdAndUpdate(id, data, { new: true }).select('-password').lean();
    }
    await initLocalStore();
    const user = memUsers.find((u) => String(u._id) === String(id));
    if (user) {
      if (data.name) user.name = data.name;
      if (data.phone !== undefined) user.phone = data.phone;
      if (data.avatar !== undefined) user.avatar = data.avatar;
      user.updatedAt = new Date();
      return user;
    }
    return null;
  },

  // LISTINGS
  async getListings(query: {
    game?: string;
    platform?: string;
    minPrice?: number;
    maxPrice?: number;
    rank?: string;
    region?: string;
    status?: string;
    search?: string;
    sort?: string;
    featured?: boolean;
    limit?: number;
  }) {
    const { isConnected } = await connectToDatabase();
    if (isConnected) {
      const filter: any = {};
      if (query.game && query.game !== 'all') filter.game = query.game;
      if (query.platform && query.platform !== 'all') filter.platform = query.platform;
      if (query.status && query.status !== 'all') filter.status = query.status;
      if (query.rank && query.rank !== 'all') filter.rank = { $regex: query.rank, $options: 'i' };
      if (query.region && query.region !== 'all') filter.region = { $regex: query.region, $options: 'i' };
      if (query.featured !== undefined) filter.featured = query.featured;

      if (query.minPrice !== undefined || query.maxPrice !== undefined) {
        filter.price = {};
        if (query.minPrice !== undefined) filter.price.$gte = Number(query.minPrice);
        if (query.maxPrice !== undefined) filter.price.$lte = Number(query.maxPrice);
      }

      if (query.search) {
        filter.$or = [
          { title: { $regex: query.search, $options: 'i' } },
          { game: { $regex: query.search, $options: 'i' } },
          { description: { $regex: query.search, $options: 'i' } },
          { rank: { $regex: query.search, $options: 'i' } },
        ];
      }

      let sortOption: any = { createdAt: -1 };
      if (query.sort === 'price_asc') sortOption = { price: 1 };
      if (query.sort === 'price_desc') sortOption = { price: -1 };
      if (query.sort === 'level_desc') sortOption = { level: -1 };

      const q = IDListing.find(filter).sort(sortOption);
      if (query.limit) q.limit(query.limit);
      return await q.lean();
    }

    await initLocalStore();
    let results = [...memListings];

    if (query.game && query.game !== 'all') {
      results = results.filter((item) => item.game.toLowerCase() === query.game!.toLowerCase());
    }
    if (query.platform && query.platform !== 'all') {
      results = results.filter((item) => item.platform.toLowerCase().includes(query.platform!.toLowerCase()));
    }
    if (query.status && query.status !== 'all') {
      results = results.filter((item) => item.status === query.status);
    }
    if (query.rank && query.rank !== 'all') {
      results = results.filter((item) => item.rank.toLowerCase().includes(query.rank!.toLowerCase()));
    }
    if (query.region && query.region !== 'all') {
      results = results.filter((item) => item.region.toLowerCase().includes(query.region!.toLowerCase()));
    }
    if (query.featured !== undefined) {
      results = results.filter((item) => item.featured === query.featured);
    }
    if (query.minPrice !== undefined) {
      results = results.filter((item) => item.price >= Number(query.minPrice));
    }
    if (query.maxPrice !== undefined) {
      results = results.filter((item) => item.price <= Number(query.maxPrice));
    }
    if (query.search) {
      const s = query.search.toLowerCase();
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(s) ||
          item.game.toLowerCase().includes(s) ||
          item.description.toLowerCase().includes(s) ||
          item.rank.toLowerCase().includes(s)
      );
    }

    if (query.sort === 'price_asc') {
      results.sort((a, b) => a.price - b.price);
    } else if (query.sort === 'price_desc') {
      results.sort((a, b) => b.price - a.price);
    } else if (query.sort === 'level_desc') {
      results.sort((a, b) => Number(b.level || 0) - Number(a.level || 0));
    } else {
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    if (query.limit) {
      results = results.slice(0, query.limit);
    }

    return results;
  },

  async getListingById(id: string) {
    const { isConnected } = await connectToDatabase();
    if (isConnected) {
      return await IDListing.findById(id).lean();
    }
    await initLocalStore();
    return memListings.find((item) => String(item._id) === String(id)) || null;
  },

  async createListing(data: any) {
    const { isConnected } = await connectToDatabase();
    if (isConnected) {
      const created = await IDListing.create(data);
      return created.toObject();
    }
    await initLocalStore();
    const newListing = {
      ...data,
      _id: `listing-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memListings.unshift(newListing);
    return newListing;
  },

  async updateListing(id: string, data: any) {
    const { isConnected } = await connectToDatabase();
    if (isConnected) {
      return await IDListing.findByIdAndUpdate(id, data, { new: true }).lean();
    }
    await initLocalStore();
    const index = memListings.findIndex((item) => String(item._id) === String(id));
    if (index !== -1) {
      memListings[index] = {
        ...memListings[index],
        ...data,
        updatedAt: new Date(),
      };
      return memListings[index];
    }
    return null;
  },

  async deleteListing(id: string) {
    const { isConnected } = await connectToDatabase();
    if (isConnected) {
      return await IDListing.findByIdAndDelete(id).lean();
    }
    await initLocalStore();
    const index = memListings.findIndex((item) => String(item._id) === String(id));
    if (index !== -1) {
      const deleted = memListings[index];
      memListings.splice(index, 1);
      return deleted;
    }
    return null;
  },

  // ORDERS
  async createOrder(data: {
    user: string;
    listingId: string;
    customerName: string;
    email: string;
    phone: string;
    paymentMethod: string;
    paymentTransactionId?: string;
    note?: string;
  }) {
    // SECURITY REQUIREMENT: Never trust the price sent from the browser!
    // Retrieve the actual listing from MongoDB and use the database price.
    const listing = await this.getListingById(data.listingId);
    if (!listing) {
      throw new Error('Gaming ID listing not found');
    }
    if (listing.status === 'sold') {
      throw new Error('This gaming ID is already SOLD OUT');
    }

    const price = listing.price; // Authoritative price from DB

    const orderPayload = {
      user: data.user,
      listing: listing,
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      price: price,
      paymentMethod: data.paymentMethod,
      paymentTransactionId: data.paymentTransactionId || '',
      note: data.note || '',
      status: 'pending' as const,
      deliveryDetails: {},
    };

    const { isConnected } = await connectToDatabase();
    if (isConnected) {
      const created = await Order.create({
        ...orderPayload,
        listing: listing._id,
      });
      return created.toObject();
    }

    await initLocalStore();
    const newOrder = {
      ...orderPayload,
      _id: `order-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memOrders.unshift(newOrder);
    return newOrder;
  },

  async getOrders(userId?: string, isAdmin = false) {
    const { isConnected } = await connectToDatabase();
    if (isConnected) {
      const filter: any = {};
      if (!isAdmin && userId) {
        filter.user = userId;
      }
      return await Order.find(filter).populate('listing').sort({ createdAt: -1 }).lean();
    }
    await initLocalStore();
    if (isAdmin) {
      return [...memOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return memOrders
      .filter((o) => String(o.user) === String(userId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getOrderById(id: string) {
    const { isConnected } = await connectToDatabase();
    if (isConnected) {
      return await Order.findById(id).populate('listing').lean();
    }
    await initLocalStore();
    return memOrders.find((o) => String(o._id) === String(id)) || null;
  },

  async updateOrderStatus(
    orderId: string,
    status: 'pending' | 'confirmed' | 'paid' | 'delivered' | 'cancelled',
    deliveryDetails?: any
  ) {
    const { isConnected } = await connectToDatabase();
    if (isConnected) {
      const updateData: any = { status };
      if (deliveryDetails) {
        updateData.deliveryDetails = {
          ...deliveryDetails,
          deliveredAt: status === 'delivered' ? new Date() : undefined,
        };
      }
      const updated = await Order.findByIdAndUpdate(orderId, updateData, { new: true }).lean();
      if (status === 'delivered' && updated && updated.listing) {
        // Mark listing as sold automatically upon delivery
        const listingId = typeof updated.listing === 'object' ? (updated.listing as any)._id : updated.listing;
        await IDListing.findByIdAndUpdate(listingId, { status: 'sold' });
      }
      return updated;
    }

    await initLocalStore();
    const order = memOrders.find((o) => String(o._id) === String(orderId));
    if (order) {
      order.status = status;
      if (deliveryDetails) {
        order.deliveryDetails = {
          ...order.deliveryDetails,
          ...deliveryDetails,
          deliveredAt: status === 'delivered' ? new Date() : order.deliveryDetails?.deliveredAt,
        };
      }
      order.updatedAt = new Date();
      if (status === 'delivered') {
        const listingId = typeof order.listing === 'object' ? order.listing._id : order.listing;
        const listing = memListings.find((l) => String(l._id) === String(listingId));
        if (listing) {
          listing.status = 'sold';
        }
      }
      return order;
    }
    return null;
  },

  // REVIEWS
  async getReviews(listingId?: string, onlyApproved = true) {
    const { isConnected } = await connectToDatabase();
    if (isConnected) {
      const filter: any = {};
      if (listingId) filter.listing = listingId;
      if (onlyApproved) filter.isApproved = true;
      return await Review.find(filter).sort({ createdAt: -1 }).lean();
    }
    await initLocalStore();
    let revs = [...memReviews];
    if (listingId) revs = revs.filter((r) => String(r.listing) === String(listingId));
    if (onlyApproved) revs = revs.filter((r) => r.isApproved);
    return revs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async createReview(data: {
    userId: string;
    userName: string;
    orderId: string;
    listingId: string;
    rating: number;
    comment: string;
  }) {
    // Only customers with delivered orders can submit reviews
    const order = await this.getOrderById(data.orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    if (String(order.user) !== String(data.userId)) {
      throw new Error('You can only review your own orders');
    }
    if (order.status !== 'delivered') {
      throw new Error('Reviews can only be submitted after your order is successfully delivered');
    }

    const { isConnected } = await connectToDatabase();
    if (isConnected) {
      const existing = await Review.findOne({ order: data.orderId });
      if (existing) {
        throw new Error('You have already submitted a review for this order');
      }
      const created = await Review.create({
        user: data.userId,
        userName: data.userName,
        listing: data.listingId,
        order: data.orderId,
        rating: data.rating,
        comment: data.comment,
        isApproved: true,
      });
      return created.toObject();
    }

    await initLocalStore();
    const existing = memReviews.find((r) => String(r.order) === String(data.orderId));
    if (existing) {
      throw new Error('You have already submitted a review for this order');
    }

    const newRev = {
      _id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      user: data.userId,
      userName: data.userName,
      listing: data.listingId,
      order: data.orderId,
      rating: data.rating,
      comment: data.comment,
      isApproved: true,
      createdAt: new Date(),
    };
    memReviews.unshift(newRev);
    return newRev;
  },

  async updateReviewStatus(reviewId: string, isApproved: boolean) {
    const { isConnected } = await connectToDatabase();
    if (isConnected) {
      return await Review.findByIdAndUpdate(reviewId, { isApproved }, { new: true }).lean();
    }
    await initLocalStore();
    const rev = memReviews.find((r) => String(r._id) === String(reviewId));
    if (rev) {
      rev.isApproved = isApproved;
      return rev;
    }
    return null;
  },

  async deleteReview(reviewId: string) {
    const { isConnected } = await connectToDatabase();
    if (isConnected) {
      return await Review.findByIdAndDelete(reviewId).lean();
    }
    await initLocalStore();
    const index = memReviews.findIndex((r) => String(r._id) === String(reviewId));
    if (index !== -1) {
      const deleted = memReviews[index];
      memReviews.splice(index, 1);
      return deleted;
    }
    return null;
  },

  // CATEGORIES
  async getCategories() {
    const { isConnected } = await connectToDatabase();
    if (isConnected) {
      return await Category.find({ active: true }).sort({ gameCount: -1 }).lean();
    }
    await initLocalStore();
    return memCategories.filter((c) => c.active);
  },

  // SITE SETTINGS
  async getSettings() {
    const { isConnected } = await connectToDatabase();
    if (isConnected) {
      let settings = await SiteSettings.findOne().lean();
      if (!settings) {
        settings = (await SiteSettings.create({})).toObject();
      }
      return settings;
    }
    await initLocalStore();
    return memSettings;
  },

  async updateSettings(data: any) {
    const { isConnected } = await connectToDatabase();
    if (isConnected) {
      let settings = await SiteSettings.findOne();
      if (!settings) {
        settings = await SiteSettings.create(data);
      } else {
        Object.assign(settings, data);
        await settings.save();
      }
      return settings.toObject();
    }
    await initLocalStore();
    memSettings = {
      ...memSettings,
      ...data,
      updatedAt: new Date(),
    };
    return memSettings;
  },

  // CONTACT MESSAGES
  async createContactMessage(data: { name: string; email: string; phone?: string; subject: string; message: string }) {
    const { isConnected } = await connectToDatabase();
    if (isConnected) {
      const created = await ContactMessage.create(data);
      return created.toObject();
    }
    await initLocalStore();
    const msg = {
      ...data,
      _id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      status: 'unread',
      createdAt: new Date(),
    };
    memMessages.unshift(msg);
    return msg;
  },

  async getContactMessages() {
    const { isConnected } = await connectToDatabase();
    if (isConnected) {
      return await ContactMessage.find().sort({ createdAt: -1 }).lean();
    }
    await initLocalStore();
    return memMessages;
  },

  async updateContactMessageStatus(id: string, status: 'unread' | 'read' | 'replied') {
    const { isConnected } = await connectToDatabase();
    if (isConnected) {
      return await ContactMessage.findByIdAndUpdate(id, { status }, { new: true }).lean();
    }
    await initLocalStore();
    const msg = memMessages.find((m) => String(m._id) === String(id));
    if (msg) {
      msg.status = status;
      return msg;
    }
    return null;
  },

  // DASHBOARD STATISTICS
  async getDashboardStats() {
    const listings = await this.getListings({});
    const orders = await this.getOrders(undefined, true);
    const users = await this.getAllUsers();

    const totalIds = listings.length;
    const availableIds = listings.filter((l) => l.status === 'available').length;
    const soldIds = listings.filter((l) => l.status === 'sold').length;
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === 'pending').length;
    const totalCustomers = users.filter((u) => u.role === 'customer').length;
    const totalRevenue = orders
      .filter((o) => o.status === 'paid' || o.status === 'delivered')
      .reduce((sum, o) => sum + (o.price || 0), 0);

    return {
      totalIds,
      availableIds,
      soldIds,
      totalOrders,
      pendingOrders,
      totalCustomers,
      totalRevenue,
    };
  },
};

export default Store;
