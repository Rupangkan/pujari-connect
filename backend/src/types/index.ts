import type { Request } from 'express';

// ─── Enums ────────────────────────────────────────────────────────────
export type Role = 'USER' | 'ADMIN' | 'PUJARI';
export type PujaType = 'ONLINE' | 'OFFLINE' | 'BOTH';
export type PujaCategory = 'HOME' | 'PERSONAL' | 'FESTIVAL' | 'TEMPLE' | 'ANCESTRAL';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

// ─── JWT Payload ──────────────────────────────────────────────────────
export interface JwtPayload {
  userId: string;
  role: Role;
  iat?: number;
  exp?: number;
}

// ─── Authenticated Request ────────────────────────────────────────────
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: Role;
  };
}

// ─── Pagination ───────────────────────────────────────────────────────
export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ─── API Response ─────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// ─── Puja Filters ─────────────────────────────────────────────────────
export interface PujaFilters {
  category?: PujaCategory;
  type?: PujaType;
  priceMin?: number;
  priceMax?: number;
  location?: string;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';
}

// ─── Pujari Filters ───────────────────────────────────────────────────
export interface PujariFilters {
  ethnicity?: string;
  ratingMin?: number;
  experienceMin?: number;
  experienceMax?: number;
  location?: string;
  sort?: 'rating_desc' | 'rating_asc' | 'experience_desc' | 'experience_asc' | 'price_asc' | 'price_desc';
}
