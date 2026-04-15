import { SECRET_MONGODB_URI } from '$env/static/private';
import mongoose from 'mongoose';
import type { Handle } from '@sveltejs/kit';

let cached = globalThis as any;

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(SECRET_MONGODB_URI);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export const handle: Handle = async ({ event, resolve }) => {
	await connectDB();

	return resolve(event);
};