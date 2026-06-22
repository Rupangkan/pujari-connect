import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllPujaris = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ethnicity, ratingMin, experienceMin, experienceMax, location, sort, page = '1', limit = '20' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = { isActive: true };
    if (ethnicity) where.ethnicity = ethnicity;
    if (location) where.location = { contains: location as string };
    if (ratingMin) where.rating = { gte: Number(ratingMin) };
    if (experienceMin || experienceMax) {
      where.experience = {};
      if (experienceMin) where.experience.gte = Number(experienceMin);
      if (experienceMax) where.experience.lte = Number(experienceMax);
    }
    const orderBy: any = sort === 'rating_desc' ? { rating: 'desc' }
      : sort === 'experience_desc' ? { experience: 'desc' }
      : sort === 'price_asc' ? { hourlyRate: 'asc' }
      : sort === 'price_desc' ? { hourlyRate: 'desc' }
      : { totalBookings: 'desc' };
    const [data, total] = await Promise.all([
      prisma.pujari.findMany({ where, orderBy, skip, take: Number(limit) }),
      prisma.pujari.count({ where }),
    ]);
    res.json({ success: true, data, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) { next(err); }
};

export const getPujariById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pujari = await prisma.pujari.findUnique({ where: { id: req.params.id } });
    if (!pujari) return res.status(404).json({ success: false, message: 'Pujari not found' });
    res.json({ success: true, data: pujari });
  } catch (err) { next(err); }
};

export const getFeaturedPujaris = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.pujari.findMany({ where: { isActive: true, isVerified: true }, orderBy: { rating: 'desc' }, take: 6 });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};
