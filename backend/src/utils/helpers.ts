import jwt from 'jsonwebtoken';
import type { JwtPayload, PaginationParams, PaginatedResponse } from '../types/index.js';

function requireEnv(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`${key} is not set. Refusing to start with an insecure default.`);
  return v;
}

const JWT_SECRET = requireEnv('JWT_SECRET');
const JWT_EXPIRY = '7d';

/**
 * Sign a JWT token with user payload
 */
export function signToken(payload: { userId: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

/**
 * Parse pagination params from query string
 */
export function parsePagination(query: { page?: string; limit?: string }): PaginationParams {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(query.limit || '10', 10)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

/**
 * Build a paginated response object
 */
export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  pagination: PaginationParams
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / pagination.limit);
  return {
    data,
    pagination: {
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages,
      hasNext: pagination.page < totalPages,
      hasPrev: pagination.page > 1,
    },
  };
}

/**
 * Generate a mock OTP (always '123456' in development)
 */
export function generateOTP(): string {
  if (process.env.NODE_ENV === 'production') {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  return '123456';
}

/**
 * Format price in INR
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
