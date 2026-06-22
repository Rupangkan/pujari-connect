import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types';

const prisma = new PrismaClient();

export const updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, email, dateOfBirth, gender, profilePicUrl } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: { name, email, dateOfBirth, gender, profilePicUrl },
    });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

export const getAddresses = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.address.findMany({ where: { userId: req.user!.userId }, orderBy: { isDefault: 'desc' } });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const addAddress = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { fullName, phone, pinCode, state, city, flatHouse, area, landmark, isDefault } = req.body;
    if (isDefault) await prisma.address.updateMany({ where: { userId: req.user!.userId }, data: { isDefault: false } });
    const address = await prisma.address.create({
      data: { userId: req.user!.userId, fullName, phone, pinCode, state, city, flatHouse, area, landmark, isDefault: isDefault || false },
    });
    res.status(201).json({ success: true, data: address });
  } catch (err) { next(err); }
};

export const deleteAddress = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.address.deleteMany({ where: { id: req.params.id, userId: req.user!.userId } });
    res.json({ success: true, message: 'Address deleted' });
  } catch (err) { next(err); }
};

export const getWishlist = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.wishlist.findMany({
      where: { userId: req.user!.userId },
      include: { puja: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: data.map(w => w.puja) });
  } catch (err) { next(err); }
};

export const toggleWishlist = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { pujaId } = req.params;
    const existing = await prisma.wishlist.findUnique({ where: { userId_pujaId: { userId: req.user!.userId, pujaId } } });
    if (existing) {
      await prisma.wishlist.delete({ where: { userId_pujaId: { userId: req.user!.userId, pujaId } } });
      res.json({ success: true, data: { wishlisted: false } });
    } else {
      await prisma.wishlist.create({ data: { userId: req.user!.userId, pujaId } });
      res.json({ success: true, data: { wishlisted: true } });
    }
  } catch (err) { next(err); }
};
