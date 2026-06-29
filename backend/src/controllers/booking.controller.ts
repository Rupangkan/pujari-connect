import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types';

const prisma = new PrismaClient();

export const createBooking = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    // NOTE: client-sent `totalAmount`/`discount` are intentionally IGNORED.
    // Price is computed server-side from DB rows so it cannot be tampered with.
    const { pujaId, pujariId, packageId, bookingDate, addressId, offeringIds, kitItems, couponCode, notes } = req.body;

    if (!pujaId && !pujariId) {
      return res.status(400).json({ success: false, message: 'A puja or pujari is required to create a booking.' });
    }
    if (!bookingDate) {
      return res.status(400).json({ success: false, message: 'bookingDate is required.' });
    }
    const when = new Date(bookingDate);
    if (Number.isNaN(when.getTime()) || when.getTime() < Date.now()) {
      return res.status(400).json({ success: false, message: 'bookingDate must be a valid future date.' });
    }

    // Validate referenced entities exist (and are active).
    const puja = pujaId ? await prisma.puja.findUnique({ where: { id: pujaId } }) : null;
    if (pujaId && (!puja || !puja.isActive)) {
      return res.status(400).json({ success: false, message: 'Invalid puja.' });
    }
    const pujari = pujariId ? await prisma.pujari.findUnique({ where: { id: pujariId } }) : null;
    if (pujariId && (!pujari || !pujari.isActive)) {
      return res.status(400).json({ success: false, message: 'Invalid pujari.' });
    }
    let pkg = null;
    if (packageId) {
      pkg = await prisma.package.findUnique({ where: { id: packageId } });
      if (!pkg || (pujaId && pkg.pujaId !== pujaId)) {
        return res.status(400).json({ success: false, message: 'Invalid package for this puja.' });
      }
    }
    // Address must belong to the caller (prevents IDOR onto another user's address).
    if (addressId) {
      const addr = await prisma.address.findFirst({ where: { id: addressId, userId } });
      if (!addr) return res.status(400).json({ success: false, message: 'Invalid address.' });
    }

    // ── Compute base price server-side ──
    let amount = 0;
    if (pkg) amount += pkg.price;
    else if (puja) amount += puja.basePrice;
    if (pujari) amount += pujari.hourlyRate;

    // ── Offerings: price from DB, must belong to the puja ──
    const offeringRows: { offeringId: string; price: number }[] = [];
    if (offeringIds?.length) {
      const offerings = await prisma.offering.findMany({ where: { id: { in: offeringIds } } });
      for (const o of offerings) {
        if (pujaId && o.pujaId !== pujaId) continue;
        amount += o.price;
        offeringRows.push({ offeringId: o.id, price: o.price });
      }
    }

    // ── Kit items: price from DB, quantity clamped to a sane positive int ──
    const kitRows: { kitItemId: string; quantity: number; price: number }[] = [];
    if (kitItems?.length) {
      const ids = kitItems.map((k: any) => k.id);
      const items = await prisma.kitItem.findMany({ where: { id: { in: ids } } });
      for (const ki of kitItems) {
        const item = items.find((i) => i.id === ki.id);
        if (!item) continue;
        if (pujaId && item.pujaId !== pujaId) continue;
        const qty = Math.max(1, Math.min(99, Math.floor(Number(ki.quantity) || 1)));
        amount += item.price * qty;
        kitRows.push({ kitItemId: item.id, quantity: qty, price: item.price });
      }
    }

    // ── Coupon: only honored if it matches the package's server-side coupon ──
    let discount = 0;
    if (couponCode && pkg?.coupon && couponCode === pkg.coupon) {
      discount = Math.round(amount * 0.1); // example: 10% off. Adjust to real coupon rules.
    }
    const totalAmount = Math.max(0, amount - discount);

    const fullBooking = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          userId,
          pujaId: pujaId ?? null,
          pujariId: pujariId ?? null,
          packageId: packageId ?? null,
          bookingDate: when,
          totalAmount,
          addressId: addressId ?? null,
          couponCode: discount > 0 ? couponCode : null,
          discount,
          notes,
          status: 'PENDING',
          paymentStatus: 'PENDING', // flipped to PAID only by a verified payment webhook
        },
      });
      for (const o of offeringRows) {
        await tx.bookingOffering.create({ data: { bookingId: booking.id, ...o } });
      }
      for (const k of kitRows) {
        await tx.bookingKitItem.create({ data: { bookingId: booking.id, ...k } });
      }
      return tx.booking.findUnique({
        where: { id: booking.id },
        include: { puja: true, pujari: true, address: true, offerings: { include: { offering: true } }, kitItems: { include: { kitItem: true } } },
      });
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
