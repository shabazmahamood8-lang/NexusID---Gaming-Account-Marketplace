import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { connectToDatabase } from './lib/mongodb.ts';
import { Store } from './lib/store.ts';
import { uploadToCloudinary } from './lib/cloudinary.ts';
import { validateListingInput, validateOrderInput, isValidEmail } from './lib/validations.ts';
import { seedDatabaseIfEmpty } from './lib/seed.ts';
import bcrypt from 'bcryptjs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Helper to authenticate user from Bearer token or custom session header
async function getUserFromRequest(req: express.Request): Promise<any | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;

  // Simple token encoding: base64 of userId:email
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId, email] = decoded.split(':');
    if (userId) {
      const user = await Store.findUserById(userId);
      return user || null;
    }
  } catch (e) {
    // If not base64, check if it is direct userId
    const user = await Store.findUserById(token);
    return user || null;
  }
  return null;
}

// Middleware to enforce authentication
async function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
  }
  (req as any).user = user;
  next();
}

// Middleware to enforce admin role
async function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const user = await getUserFromRequest(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required.' });
  }
  (req as any).user = user;
  next();
}

// ==========================================
// AUTH ROUTES (Better Auth compatible API)
// ==========================================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const existing = await Store.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Store.createUser({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || '',
      role: 'customer',
    });

    const token = Buffer.from(`${user._id}:${user.email}`).toString('base64');
    const { password: _, ...safeUser } = user;

    res.json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: safeUser,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await Store.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password || '');
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = Buffer.from(`${user._id}:${user.email}`).toString('base64');
    const { password: _, ...safeUser } = user;

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: safeUser,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Login failed' });
  }
});

app.get('/api/auth/session', async (req, res) => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return res.json({ session: null, user: null });
    }
    const { password: _, ...safeUser } = user;
    res.json({
      session: {
        userId: user._id,
        expires: new Date(Date.now() + 7 * 86400000).toISOString(),
      },
      user: safeUser,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/auth/logout', (_req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// ==========================================
// GAMING ID LISTINGS ROUTES
// ==========================================

app.get('/api/ids', async (req, res) => {
  try {
    const { game, platform, minPrice, maxPrice, rank, region, status, search, sort, featured, limit } = req.query;
    const listings = await Store.getListings({
      game: game as string,
      platform: platform as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      rank: rank as string,
      region: region as string,
      status: status as string,
      search: search as string,
      sort: sort as string,
      featured: featured !== undefined ? featured === 'true' : undefined,
      limit: limit ? Number(limit) : undefined,
    });
    res.json({ success: true, count: listings.length, data: listings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/ids/:id', async (req, res) => {
  try {
    const listing = await Store.getListingById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Gaming ID listing not found' });
    }
    res.json({ success: true, data: listing });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/ids', requireAdmin, async (req, res) => {
  try {
    const validation = validateListingInput(req.body);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.errors.join(', ') });
    }

    const payload = {
      ...req.body,
      price: Number(req.body.price),
      originalPrice: Number(req.body.originalPrice || req.body.price),
      level: req.body.level || 1,
      status: req.body.status || 'available',
      featured: Boolean(req.body.featured),
      seller: req.body.seller || {
        name: 'Nexus Verified Seller',
        rating: 4.95,
        verified: true,
      },
    };

    const created = await Store.createListing(payload);
    res.status(201).json({ success: true, message: 'Listing created successfully', data: created });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/ids/:id', requireAdmin, async (req, res) => {
  try {
    const updated = await Store.updateListing(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    res.json({ success: true, message: 'Listing updated successfully', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/ids/:id', requireAdmin, async (req, res) => {
  try {
    const deleted = await Store.deleteListing(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    res.json({ success: true, message: 'Listing deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// ORDERS ROUTES
// ==========================================

app.post('/api/orders', requireAuth, async (req, res) => {
  try {
    const user = (req as any).user;
    const validation = validateOrderInput(req.body);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.errors.join(', ') });
    }

    // PRD REQUIREMENT: Never trust client price! Store retrieves database price.
    const order = await Store.createOrder({
      user: user._id,
      listingId: req.body.listingId,
      customerName: req.body.customerName,
      email: req.body.email,
      phone: req.body.phone,
      paymentMethod: req.body.paymentMethod,
      paymentTransactionId: req.body.paymentTransactionId,
      note: req.body.note,
    });

    res.status(201).json({ success: true, message: 'Order created successfully', data: order });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.get('/api/orders', requireAuth, async (req, res) => {
  try {
    const user = (req as any).user;
    const isAdmin = user.role === 'admin';
    const orders = await Store.getOrders(user._id, isAdmin);
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/orders/:id', requireAuth, async (req, res) => {
  try {
    const user = (req as any).user;
    const order = await Store.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Access control: customer can only view their own order
    if (user.role !== 'admin' && String(order.user) !== String(user._id)) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this order' });
    }

    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/orders/:id', requireAdmin, async (req, res) => {
  try {
    const { status, deliveryDetails } = req.body;
    const updated = await Store.updateOrderStatus(req.params.id, status, deliveryDetails);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, message: 'Order updated successfully', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// REVIEWS ROUTES
// ==========================================

app.get('/api/reviews', async (req, res) => {
  try {
    const { listingId, all } = req.query;
    const onlyApproved = all !== 'true';
    const reviews = await Store.getReviews(listingId as string, onlyApproved);
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/reviews', requireAuth, async (req, res) => {
  try {
    const user = (req as any).user;
    const { orderId, listingId, rating, comment } = req.body;
    if (!orderId || !listingId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating, comment, orderId, and listingId are required' });
    }

    const review = await Store.createReview({
      userId: user._id,
      userName: user.name,
      orderId,
      listingId,
      rating: Number(rating),
      comment: comment.trim(),
    });

    res.status(201).json({ success: true, message: 'Thank you! Your review has been submitted.', data: review });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.put('/api/reviews/:id', requireAdmin, async (req, res) => {
  try {
    const { isApproved } = req.body;
    const updated = await Store.updateReviewStatus(req.params.id, Boolean(isApproved));
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.json({ success: true, message: 'Review status updated', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/reviews/:id', requireAdmin, async (req, res) => {
  try {
    const deleted = await Store.deleteReview(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// CATEGORIES & SETTINGS & MESSAGES & USERS
// ==========================================

app.get('/api/categories', async (_req, res) => {
  try {
    const categories = await Store.getCategories();
    res.json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/settings', async (_req, res) => {
  try {
    const settings = await Store.getSettings();
    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/settings', requireAdmin, async (req, res) => {
  try {
    const updated = await Store.updateSettings(req.body);
    res.json({ success: true, message: 'Settings saved successfully', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, subject, and message are required' });
    }
    const created = await Store.createContactMessage({ name, email, phone, subject, message });
    res.status(201).json({ success: true, message: 'Your message has been sent. We will get back to you shortly!', data: created });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/contact', requireAdmin, async (_req, res) => {
  try {
    const messages = await Store.getContactMessages();
    res.json({ success: true, data: messages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/contact/:id', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Store.updateContactMessageStatus(req.params.id, status);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/users', requireAdmin, async (_req, res) => {
  try {
    const users = await Store.getAllUsers();
    res.json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/users/:id/role', requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be either customer or admin' });
    }
    const updated = await Store.updateUserRole(req.params.id, role);
    res.json({ success: true, message: 'User role updated', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/users/profile', requireAuth, async (req, res) => {
  try {
    const user = (req as any).user;
    const { name, phone, avatar } = req.body;
    const updated = await Store.updateUserProfile(user._id, { name, phone, avatar });
    res.json({ success: true, message: 'Profile updated successfully', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/stats', requireAdmin, async (_req, res) => {
  try {
    const stats = await Store.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CLOUDINARY IMAGE UPLOAD
app.post('/api/upload', requireAdmin, async (req, res) => {
  try {
    const { image, folder } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, message: 'Image base64 or URL is required' });
    }
    const result = await uploadToCloudinary(image, folder || 'gaming_ids');
    if (!result.success) {
      return res.status(500).json({ success: false, message: result.error || 'Upload failed' });
    }
    res.json({ success: true, url: result.url, public_id: result.public_id });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// OPTIONAL DATABASE SEED ROUTE
app.post('/api/seed', requireAdmin, async (_req, res) => {
  try {
    await seedDatabaseIfEmpty();
    res.json({ success: true, message: 'Seed verification completed.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mount Vite middleware in development
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  // Attempt database connection in background
  connectToDatabase().then(({ isConnected }) => {
    if (isConnected) {
      seedDatabaseIfEmpty();
    }
  });

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NexusID Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[NexusID Server] Fatal initialization error:', err);
});

export default app;
