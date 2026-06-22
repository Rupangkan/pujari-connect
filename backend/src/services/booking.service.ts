import { PrismaClient } from '@prisma/client';
import type { PaginationParams } from '../types/index.js';
import { buildPaginatedResponse } from '../utils/helpers.js';
import { AppError } from '../middleware/error.middleware.js';

const prisma = new PrismaClient();

interface CreateBookingData {
  userId: string;
  pujaId: string;
  pujariId?: string;
  packageId?: string;
  bookingDate: string;
  addressId?: string;
  notes?: string;
  couponCode?: string;
  offeringIds?: string[];
  kitItemSelections?: Array<{ kitItemId: string; quantity: number }>;
}

/**
 * Create a new booking
 */
export async function createBooking(data: CreateBookingData) {
  // Verify puja exists
  const puja = await prisma.puja.findUnique({ where: { id: data.pujaId } });
  if (!puja) {
    throw new AppError('Puja not found.', 404);
  }

  // Verify pujari exists if provided
  if (data.pujariId) {
    const pujari = await prisma.pujari.findUnique({ where: { id: data.pujariId } });
    if (!pujari) {
      throw new AppError('Pujari not found.', 404);
    }
  }

  // Calculate total amount
  let totalAmount = puja.basePrice;

  // If a package is selected, use package price instead
  if (data.packageId) {
    const pkg = await prisma.package.findUnique({ where: { id: data.packageId } });
    if (!pkg) {
      throw new AppError('Package not found.', 404);
    }
    totalAmount = pkg.price;
  }

  // Calculate offerings total
  let offeringsTotal = 0;
  if (data.offeringIds && data.offeringIds.length > 0) {
    const offerings = await prisma.offering.findMany({
      where: { id: { in: data.offeringIds } },
    });
    offeringsTotal = offerings.reduce((sum, o) => sum + o.price, 0);
  }

  // Calculate kit items total
  let kitItemsTotal = 0;
  if (data.kitItemSelections && data.kitItemSelections.length > 0) {
    const kitItemIds = data.kitItemSelections.map((k) => k.kitItemId);
    const kitItems = await prisma.kitItem.findMany({
      where: { id: { in: kitItemIds } },
    });
    for (const selection of data.kitItemSelections) {
      const item = kitItems.find((k) => k.id === selection.kitItemId);
      if (item) {
        kitItemsTotal += item.price * selection.quantity;
      }
    }
  }

  totalAmount += offeringsTotal + kitItemsTotal;

  // Apply discount if coupon code matches a package coupon
  let discount = 0;
  if (data.couponCode && data.packageId) {
    const pkg = await prisma.package.findUnique({ where: { id: data.packageId } });
    if (pkg?.coupon === data.couponCode) {
      discount = totalAmount * 0.1; // 10% discount
    }
  }

  totalAmount -= discount;

  // Verify address exists if provided
  if (data.addressId) {
    const address = await prisma.address.findUnique({ where: { id: data.addressId } });
    if (!address || address.userId !== data.userId) {
      throw new AppError('Address not found or does not belong to you.', 404);
    }
  }

  // Create booking with related data
  const booking = await prisma.booking.create({
    data: {
      userId: data.userId,
      pujaId: data.pujaId,
      pujariId: data.pujariId || null,
      packageId: data.packageId || null,
      bookingDate: new Date(data.bookingDate),
      totalAmount,
      discount,
      couponCode: data.couponCode || null,
      addressId: data.addressId || null,
      notes: data.notes || null,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      bookingOfferings: data.offeringIds
        ? {
            create: await Promise.all(
              data.offeringIds.map(async (offeringId) => {
                const offering = await prisma.offering.findUnique({ where: { id: offeringId } });
                return {
                  offeringId,
                  price: offering?.price || 0,
                };
              })
            ),
          }
        : undefined,
      bookingKitItems: data.kitItemSelections
        ? {
            create: await Promise.all(
              data.kitItemSelections.map(async (selection) => {
                const kitItem = await prisma.kitItem.findUnique({ where: { id: selection.kitItemId } });
                return {
                  kitItemId: selection.kitItemId,
                  quantity: selection.quantity,
                  price: (kitItem?.price || 0) * selection.quantity,
                };
              })
            ),
          }
        : undefined,
    },
    include: {
      puja: true,
      pujari: true,
      package: true,
      address: true,
      bookingOfferings: { include: { offering: true } },
      bookingKitItems: { include: { kitItem: true } },
    },
  });

  // Update pujari total bookings
  if (data.pujariId) {
    await prisma.pujari.update({
      where: { id: data.pujariId },
      data: { totalBookings: { increment: 1 } },
    });
  }

  return booking;
}

/**
 * Get all bookings for a user
 */
export async function getUserBookings(userId: string, pagination: PaginationParams) {
  const where = { userId };

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: pagination.skip,
      take: pagination.limit,
      include: {
        puja: {
          select: { id: true, name: true, category: true, location: true, imageUrl: true, basePrice: true },
        },
        pujari: {
          select: { id: true, name: true, imageUrl: true, rating: true },
        },
        package: {
          select: { id: true, title: true, price: true },
        },
        address: true,
      },
    }),
    prisma.booking.count({ where }),
  ]);

  return buildPaginatedResponse(bookings, total, pagination);
}

/**
 * Get a single booking by ID
 */
export async function getBookingById(bookingId: string, userId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      puja: true,
      pujari: true,
      package: { include: { details: true } },
      address: true,
      bookingOfferings: { include: { offering: true } },
      bookingKitItems: { include: { kitItem: true } },
    },
  });

  if (!booking) {
    throw new AppError('Booking not found.', 404);
  }

  if (booking.userId !== userId) {
    throw new AppError('You do not have permission to view this booking.', 403);
  }

  return {
    ...booking,
    package: booking.package
      ? {
          ...booking.package,
          details: booking.package.details.map((d) => ({
            ...d,
            items: JSON.parse(d.items) as string[],
          })),
        }
      : null,
  };
}

/**
 * Cancel a booking
 */
export async function cancelBooking(bookingId: string, userId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new AppError('Booking not found.', 404);
  }

  if (booking.userId !== userId) {
    throw new AppError('You do not have permission to cancel this booking.', 403);
  }

  if (booking.status === 'CANCELLED') {
    throw new AppError('Booking is already cancelled.', 400);
  }

  if (booking.status === 'COMPLETED') {
    throw new AppError('Cannot cancel a completed booking.', 400);
  }

  if (booking.status === 'IN_PROGRESS') {
    throw new AppError('Cannot cancel a booking that is in progress.', 400);
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: 'CANCELLED',
      paymentStatus: booking.paymentStatus === 'COMPLETED' ? 'REFUNDED' : 'FAILED',
    },
    include: {
      puja: { select: { name: true } },
      pujari: { select: { name: true } },
    },
  });

  return updatedBooking;
}
