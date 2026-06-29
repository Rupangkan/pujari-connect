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
    // Client-sent prices are IGNORED. Price comes from the DB only.
    const { items } = req.body;
    if (!items?.length) return res.status(400).json({ success: false, message: 'No items in order' });

    const ids = items.map((i: any) => i.id);
    const rows = await prisma.samagriItem.findMany({ where: { id: { in: ids } } });

    let total = 0;
    const lineItems = [];
    for (const i of items) {
      const item = rows.find((r) => r.id === i.id);
      if (!item) return res.status(400).json({ success: false, message: `Invalid item: ${i.id}` });
      if (!item.inStock) return res.status(400).json({ success: false, message: `Out of stock: ${item.name}` });
      const qty = Math.max(1, Math.min(99, Math.floor(Number(i.quantity) || 1)));
      total += item.price * qty;
      lineItems.push({ id: item.id, name: item.name, price: item.price, quantity: qty });
    }

    res.status(201).json({ success: true, data: { orderId: `ORD_${Date.now()}`, total, items: lineItems, status: 'CONFIRMED' } });
  } catch (err) { next(err); }
};
