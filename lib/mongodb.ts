import mongoose from 'mongoose';

/**
 * MongoDB Atlas Connection with caching for Node.js / Serverless / Express runtimes.
 * Prevents multiple connections during hot-reloads and request cycles.
 */

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'gaming_marketplace';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  isConnected: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = globalThis.mongooseCache || {
  conn: null,
  promise: null,
  isConnected: false,
};

if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<{ isConnected: boolean; mongooseInstance: typeof mongoose | null }> {
  if (!MONGODB_URI) {
    // If MONGODB_URI is not set, we flag that MongoDB is not connected so the store fallback can operate seamlessly.
    return { isConnected: false, mongooseInstance: null };
  }

  if (cached.conn && cached.isConnected) {
    return { isConnected: true, mongooseInstance: cached.conn };
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      dbName: MONGODB_DB_NAME,
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      cached.isConnected = true;
      console.log(`[MongoDB] Connected successfully to database: ${MONGODB_DB_NAME}`);
      return mongooseInstance;
    }).catch((err) => {
      console.warn('[MongoDB] Connection attempt failed, operating in fallback resilient mode:', err.message);
      cached.promise = null;
      cached.isConnected = false;
      return null as any;
    });
  }

  try {
    cached.conn = await cached.promise;
    return { isConnected: !!cached.conn, mongooseInstance: cached.conn };
  } catch (e) {
    cached.promise = null;
    cached.isConnected = false;
    return { isConnected: false, mongooseInstance: null };
  }
}

export default connectToDatabase;
