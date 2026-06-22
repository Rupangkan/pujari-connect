import { PrismaClient, type Prisma } from '@prisma/client';
import type { PujariFilters, PaginationParams } from '../types/index.js';
import { buildPaginatedResponse } from '../utils/helpers.js';
import { AppError } from '../middleware/error.middleware.js';

const prisma = new PrismaClient();

/**
 * Build Prisma where clause from pujari filters
 */
function buildPujariWhereClause(filters: PujariFilters): Prisma.PujariWhereInput {
  const where: Prisma.PujariWhereInput = { isActive: true };

  if (filters.ethnicity) {
    where.ethnicity = filters.ethnicity;
  }

  if (filters.ratingMin !== undefined) {
    where.rating = { gte: filters.ratingMin };
  }

  if (filters.experienceMin !== undefined || filters.experienceMax !== undefined) {
    where.experience = {};
    if (filters.experienceMin !== undefined) {
      where.experience.gte = filters.experienceMin;
    }
    if (filters.experienceMax !== undefined) {
      where.experience.lte = filters.experienceMax;
    }
  }

  if (filters.location) {
    where.location = { contains: filters.location };
  }

  return where;
}

/**
 * Build Prisma orderBy from sort parameter
 */
function buildPujariOrderBy(sort?: string): Prisma.PujariOrderByWithRelationInput {
  switch (sort) {
    case 'rating_desc':
      return { rating: 'desc' };
    case 'rating_asc':
      return { rating: 'asc' };
    case 'experience_desc':
      return { experience: 'desc' };
    case 'experience_asc':
      return { experience: 'asc' };
    case 'price_asc':
      return { hourlyRate: 'asc' };
    case 'price_desc':
      return { hourlyRate: 'desc' };
    default:
      return { rating: 'desc' };
  }
}

/**
 * Get all pujaris with filters and pagination
 */
export async function getAllPujaris(filters: PujariFilters, pagination: PaginationParams) {
  const where = buildPujariWhereClause(filters);
  const orderBy = buildPujariOrderBy(filters.sort);

  const [pujaris, total] = await Promise.all([
    prisma.pujari.findMany({
      where,
      orderBy,
      skip: pagination.skip,
      take: pagination.limit,
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    }),
    prisma.pujari.count({ where }),
  ]);

  return buildPaginatedResponse(pujaris, total, pagination);
}

/**
 * Get a single pujari by ID with booking history
 */
export async function getPujariById(id: string) {
  const pujari = await prisma.pujari.findUnique({
    where: { id },
    include: {
      _count: {
        select: { bookings: true },
      },
      bookings: {
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          puja: { select: { name: true, category: true } },
        },
      },
    },
  });

  if (!pujari) {
    throw new AppError('Pujari not found.', 404);
  }

  return pujari;
}

/**
 * Get featured pujaris (top-rated and verified)
 */
export async function getFeaturedPujaris() {
  const pujaris = await prisma.pujari.findMany({
    where: { isActive: true, isVerified: true },
    take: 4,
    orderBy: { rating: 'desc' },
    include: {
      _count: {
        select: { bookings: true },
      },
    },
  });

  return pujaris;
}
