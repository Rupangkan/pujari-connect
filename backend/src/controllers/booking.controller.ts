import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types';

const prisma = new PrismaClient();

export const createBooking = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { pujaId, pujariId, packageId, bookingDate, totalAmount, addressId, offeringIds, kitItems, couponCode, discount, notes } = req.body;
    const booking = await prisma.booking.create({
      data: {
        userId: req.user!.userId,
        pujaId,
        pujariId,
        packageId,
        bookingDate: new Date(bookingDate),
        totalAmount,
        addressId,
        couponCode,
        discount: discount || 0,
        notes,
        status: 'PENDING',
        paymentStatus: 'PENDING',
      },
    });
    // Add offerings
    if (offeringIds?.length) {
      for (const offeringId of offeringIds) {
        const offering = await prisma.offering.findUnique({ where: { id: offeringId } });
        if (offering) await prisma.bookingOffering.create({ data: { bookingId: booking.id, offeringId, price: offering.price } });
      }
    }
    // Add kit items
    if (kitItems?.length) {
      for (const ki of kitItems) {
        const kitItem = await prisma.kitItem.findUnique({ where: { id: ki.id } });
        if (kitItem) await prisma.bookingKitItem.create({ data: { bookingId: booking.id, kitItemId: ki.id, quantity: ki.quantity, price: kitItem.price } });
      }
    }
    const fullBooking = await prisma.booking.findUnique({
      where: { id: booking.id },
      include: { puja: true, pujari: true, address: true, offerings: { include: { offering: true } }, kitItems: { include: { kitItem: true } } },
    });
    res.status(201).json({ success: true, data: fullBooking });
  } catch (err) { next(err); }
};

export const getUserBookings = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user!.userId },
      include: { puja: true, pujari: true, address: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: bookings });
  } catch (err) { next(err); }
};

export const getBookingById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const booking = await prisma.booking.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
      include: { puja: true, pujari: true, address: true, offerings: { include: { offering: true } }, kitItems: { include: { kitItem: true } } },
    });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (err) { next(err); }
};

export const cancelBooking = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const booking = await prisma.booking.findFirst({ where: { id: req.params.id, userId: req.user!.userId } });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (['COMPLETED', 'CANCELLED'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel a ${booking.status.toLowerCase()} booking` });
    }
    const updated = await prisma.booking.update({ where: { id: req.params.id }, data: { status: 'CANCELLED' } });
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
};
