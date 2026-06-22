import { PrismaClient, type Prisma } from '@prisma/client';
import type { PujaFilters, PaginationParams } from '../types/index.js';
import { buildPaginatedResponse } from '../utils/helpers.js';
import { AppError } from '../middleware/error.middleware.js';

const prisma = new PrismaClient();

/**
 * Build Prisma where clause from puja filters
 */
function buildPujaWhereClause(filters: PujaFilters): Prisma.PujaWhereInput {
  const where: Prisma.PujaWhereInput = { isActive: true };

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.type) {
    where.type = filters.type;
  }

  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    where.basePrice = {};
    if (filters.priceMin !== undefined) {
      where.basePrice.gte = filters.priceMin;
    }
    if (filters.priceMax !== undefined) {
      where.basePrice.lte = filters.priceMax;
    }
  }

  if (filters.location) {
    where.location = { contains: filters.location };
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search } },
      { description: { contains: filters.search } },
      { location: { contains: filters.search } },
    ];
  }

  return where;
}

/**
 * Build Prisma orderBy from sort parameter
 */
function buildPujaOrderBy(sort?: string): Prisma.PujaOrderByWithRelationInput {
  switch (sort) {
    case 'price_asc':
      return { basePrice: 'asc' };
    case 'price_desc':
      return { basePrice: 'desc' };
    case 'name_asc':
      return { name: 'asc' };
    case 'name_desc':
      return { name: 'desc' };
    case 'newest':
      return { createdAt: 'desc' };
    default:
      return { createdAt: 'desc' };
  }
}

/**
 * Get all pujas with filters and pagination
 */
export async function getAllPujas(filters: PujaFilters, pagination: PaginationParams) {
  const where = buildPujaWhereClause(filters);
  const orderBy = buildPujaOrderBy(filters.sort);

  const [pujas, total] = await Promise.all([
    prisma.puja.findMany({
      where,
      orderBy,
      skip: pagination.skip,
      take: pagination.limit,
      include: {
        packages: {
          include: { details: true },
        },
        faqs: true,
        kitItems: true,
        offerings: true,
        _count: {
          select: { bookings: true, wishlists: true },
        },
      },
    }),
    prisma.puja.count({ where }),
  ]);

  // Parse JSON array fields
  const parsedPujas = pujas.map((puja) => ({
    ...puja,
    images: JSON.parse(puja.images) as string[],
    packages: puja.packages.map((pkg) => ({
      ...pkg,
      details: pkg.details.map((d) => ({
        ...d,
        items: JSON.parse(d.items) as string[],
      })),
    })),
  }));

  return buildPaginatedResponse(parsedPujas, total, pagination);
}

/**
 * Get a single puja by ID with all related data
 */
export async function getPujaById(id: string) {
  const puja = await prisma.puja.findUnique({
    where: { id },
    include: {
      packages: {
        include: { details: true },
      },
      faqs: true,
      kitItems: {
        orderBy: { isOptional: 'asc' },
      },
      offerings: true,
      _count: {
        select: { bookings: true, wishlists: true },
      },
    },
  });

  if (!puja) {
    throw new AppError('Puja not found.', 404);
  }

  return {
    ...puja,
    images: JSON.parse(puja.images) as string[],
    packages: puja.packages.map((pkg) => ({
      ...pkg,
      details: pkg.details.map((d) => ({
        ...d,
        items: JSON.parse(d.items) as string[],
      })),
    })),
  };
}

/**
 * Get featured pujas (top 5 by bookings)
 */
export async function getFeaturedPujas() {
  const pujas = await prisma.puja.findMany({
    where: { isActive: true },
    take: 5,
    include: {
      _count: {
        select: { bookings: true },
      },
    },
    orderBy: {
      bookings: { _count: 'desc' },
    },
  });

  return pujas.map((puja) => ({
    ...puja,
    images: JSON.parse(puja.images) as string[],
  }));
}

/**
 * Get all unique puja categories with counts
 */
export async function getPujaCategories() {
  const categories = await prisma.puja.groupBy({
    by: ['category'],
    where: { isActive: true },
    _count: { id: true },
    _min: { basePrice: true },
  });

  return categories.map((cat) => ({
    category: cat.category,
    count: cat._count.id,
    startingPrice: cat._min.basePrice,
  }));
}
