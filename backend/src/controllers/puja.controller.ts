import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllPujas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, type, priceMin, priceMax, location, search, sort, page = '1', limit = '20' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = { isActive: true };
    if (category) where.category = category;
    if (type) where.type = type;
    if (location) where.location = { contains: location as string };
    if (search) where.name = { contains: search as string };
    if (priceMin || priceMax) {
      where.basePrice = {};
      if (priceMin) where.basePrice.gte = Number(priceMin);
      if (priceMax) where.basePrice.lte = Number(priceMax);
    }
    const orderBy: any = sort === 'price_asc' ? { basePrice: 'asc' }
      : sort === 'price_desc' ? { basePrice: 'desc' }
      : sort === 'name_asc' ? { name: 'asc' }
      : { createdAt: 'desc' };
    const [data, total] = await Promise.all([
      prisma.puja.findMany({ where, orderBy, skip, take: Number(limit), include: { packages: { include: { details: true } }, faqs: true, kitItems: true, offerings: true } }),
      prisma.puja.count({ where }),
    ]);
    res.json({ success: true, data, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) { next(err); }
};

export const getPujaById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const puja = await prisma.puja.findUnique({
      where: { id: req.params.id },
      include: { packages: { include: { details: true } }, faqs: true, kitItems: true, offerings: true },
    });
    if (!puja) return res.status(404).json({ success: false, message: 'Puja not found' });
    res.json({ success: true, data: puja });
  } catch (err) { next(err); }
};

export const getFeaturedPujas = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.puja.findMany({
      where: { isActive: true },
      take: 5,
      orderBy: { basePrice: 'asc' },
      include: { packages: true },
    });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const getPujaCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = ['HOME', 'PERSONAL', 'FESTIVAL', 'TEMPLE', 'ANCESTRAL'];
    res.json({ success: true, data: categories });
  } catch (err) { next(err); }
};
