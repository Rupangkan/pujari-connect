import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types';

const prisma = new PrismaClient();

export const getAllSamagri = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.query;
    const where: any = {};
    if (category && category !== 'All') where.category = category;
    const data = await prisma.samagriItem.findMany({ where, orderBy: { category: 'asc' } });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const placeSamagriOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Placeholder: In a real app this would create an order record
    const { items, addressId } = req.body;
    if (!items?.length) return res.status(400).json({ success: false, message: 'No items in order' });
    const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    res.status(201).json({ success: true, data: { orderId: `ORD_${Date.now()}`, total, items, status: 'CONFIRMED' } });
  } catch (err) { next(err); }
};
