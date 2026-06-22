import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types';

const prisma = new PrismaClient();

// In-memory OTP store for dev (replace with Redis/SMS in production)
const otpStore = new Map<string, { otp: string; expires: number }>();

const signToken = (userId: string, role: string) =>
  jwt.sign({ userId, role }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });

/** POST /api/auth/send-otp */
export const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber || !/^[6-9]\d{9}$/.test(phoneNumber)) {
      return res.status(400).json({ success: false, message: 'Invalid phone number' });
    }
    // Dev: always use OTP 123456
    const otp = process.env.NODE_ENV === 'production'
      ? Math.floor(100000 + Math.random() * 900000).toString()
      : '123456';
    otpStore.set(phoneNumber, { otp, expires: Date.now() + 5 * 60 * 1000 });
    console.log(`📱 OTP for ${phoneNumber}: ${otp}`);
    res.json({ success: true, message: 'OTP sent successfully', ...(process.env.NODE_ENV !== 'production' && { otp }) });
  } catch (err) { next(err); }
};

/** POST /api/auth/verify-otp */
export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phoneNumber, otp } = req.body;
    const stored = otpStore.get(phoneNumber);
    if (!stored || stored.otp !== otp || Date.now() > stored.expires) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
    otpStore.delete(phoneNumber);
    let user = await prisma.user.findUnique({ where: { phoneNumber } });
    if (!user) {
      user = await prisma.user.create({ data: { phoneNumber, name: `User ${phoneNumber.slice(-4)}` } });
    }
    const token = signToken(user.id, user.role);
    res.json({ success: true, data: { token, user } });
  } catch (err) { next(err); }
};

/** POST /api/auth/google */
export const googleSignIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { googleId, email, name, profilePicUrl } = req.body;
    if (!googleId) return res.status(400).json({ success: false, message: 'Google ID required' });
    let user = await prisma.user.findUnique({ where: { googleId } });
    if (!user) {
      user = await prisma.user.create({ data: { googleId, email, name: name || 'User', profilePicUrl, phoneNumber: `google_${googleId}` } });
    }
    const token = signToken(user.id, user.role);
    res.json({ success: true, data: { token, user } });
  } catch (err) { next(err); }
};

/** GET /api/auth/me */
export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};
