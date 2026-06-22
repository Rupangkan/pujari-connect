/**
 * Pujari Service — Pujari listing and details
 */

import api from '@/services/api';
import { Pujari, PujariFilters, ApiResponse, PaginatedResponse } from '@/types';

/**
 * Converts a PujariFilters object to a URLSearchParams-compatible record,
 * stripping undefined/null values.
 */
const buildFilterParams = (filters?: PujariFilters): Record<string, string> => {
  if (!filters) return {};

  const params: Record<string, string> = {};

  if (filters.ethnicity) params.ethnicity = filters.ethnicity;
  if (filters.ratingMin !== undefined) params.ratingMin = String(filters.ratingMin);
  if (filters.ratingMax !== undefined) params.ratingMax = String(filters.ratingMax);
  if (filters.experienceMin !== undefined) params.experienceMin = String(filters.experienceMin);
  if (filters.experienceMax !== undefined) params.experienceMax = String(filters.experienceMax);
  if (filters.location) params.location = filters.location;
  if (filters.search) params.search = filters.search;
  if (filters.sort) params.sort = filters.sort;

  return params;
};

export const pujariService = {
  /** Get all pujaris with optional filters */
  getAll: (filters?: PujariFilters) =>
    api.get<PaginatedResponse<Pujari>>('/pujaris', { params: buildFilterParams(filters) }),

  /** Get a single pujari by ID */
  getById: (id: string) =>
    api.get<ApiResponse<Pujari>>(`/pujaris/${id}`),

  /** Get featured pujaris for the home screen */
  getFeatured: () =>
    api.get<ApiResponse<Pujari[]>>('/pujaris/featured'),
};
