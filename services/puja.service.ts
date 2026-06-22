/**
 * Puja Service — Puja listing, details, and categories
 */

import api from '@/services/api';
import { Puja, PujaCategory, PujaFilters, ApiResponse, PaginatedResponse } from '@/types';

/**
 * Converts a PujaFilters object to a URLSearchParams-compatible record,
 * stripping undefined/null values.
 */
const buildFilterParams = (filters?: PujaFilters): Record<string, string> => {
  if (!filters) return {};

  const params: Record<string, string> = {};

  if (filters.category) params.category = filters.category;
  if (filters.type) params.type = filters.type;
  if (filters.priceMin !== undefined) params.priceMin = String(filters.priceMin);
  if (filters.priceMax !== undefined) params.priceMax = String(filters.priceMax);
  if (filters.durationMin !== undefined) params.durationMin = String(filters.durationMin);
  if (filters.durationMax !== undefined) params.durationMax = String(filters.durationMax);
  if (filters.location) params.location = filters.location;
  if (filters.search) params.search = filters.search;
  if (filters.sort) params.sort = filters.sort;

  return params;
};

export const pujaService = {
  /** Get all pujas with optional filters */
  getAll: (filters?: PujaFilters) =>
    api.get<PaginatedResponse<Puja>>('/pujas', { params: buildFilterParams(filters) }),

  /** Get a single puja by ID */
  getById: (id: string) =>
    api.get<ApiResponse<Puja>>(`/pujas/${id}`),

  /** Get featured pujas for the home screen */
  getFeatured: () =>
    api.get<ApiResponse<Puja[]>>('/pujas/featured'),

  /** Get all puja categories */
  getCategories: () =>
    api.get<ApiResponse<{ category: PujaCategory; label: string; count: number }[]>>(
      '/pujas/categories'
    ),
};
