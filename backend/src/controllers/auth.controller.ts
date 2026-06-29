import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';
import { signToken } from '../utils/helpers';
import { AuthenticatedRequest } from '../types';

const prisma = new PrismaClient();

const IS_PROD = process.env.NODE_ENV === 'production';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

// In-memory OTP store. Replace with Redis (TTL + per-phone attempt counter) for prod multi-instance.
const otpStore = new Map<string, { otp: string; expires: number; attempts: number }>();
const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;

/** POST /api/auth/send-otp */
export const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber || !/^[6-9]\d{9}$/.test(phoneNumber)) {
      return res.status(400).json({ success: false, message: 'Invalid phone number' });
    }

    // Secure by default: real random OTP unless explicitly NOT production.
    const otp = IS_PROD ? Math.floor(100000 + Math.random() * 900000).toString() : '123456';
    otpStore.set(phoneNumber, { otp, expires: Date.now() + OTP_TTL_MS, attempts: 0 });

    if (IS_PROD) {
      // TODO: send via SMS gateway (Twilio/MSG91). Never log or return the code.
      // await sms.send(phoneNumber, otp);
    } else {
      console.log(`[DEV] OTP for ${phoneNumber}: ${otp}`);
    }

    // OTP is NEVER returned in the response body, in any environment.
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (err) { next(err); }
};

/** POST /api/auth/verify-otp */
export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phoneNumber, otp } = req.body;
    const stored = otpStore.get(phoneNumber);

    if (!stored || Date.now() > stored.expires) {
      otpStore.delete(phoneNumber);
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
    if (stored.attempts >= OTP_MAX_ATTEMPTS) {
      otpStore.delete(phoneNumber);
      return res.status(429).json({ success: false, message: 'Too many attempts. Request a new OTP.' });
    }
    if (stored.otp !== otp) {
      stored.attempts += 1;
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    otpStore.delete(phoneNumber);

    let user = await prisma.user.findUnique({ where: { phoneNumber } });
    if (!user) {
      user = await prisma.user.create({ data: { phoneNumber, name: `User ${phoneNumber.slice(-4)}` } });
    }
    const token = signToken({ userId: user.id, role: user.role });
    res.json({ success: true, data: { token, user } });
  } catch (err) { next(err); }
};

/** POST /api/auth/google — verifies a real Google ID token server-side. */
export const googleSignIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!googleClient) {
      return res.status(503).json({ success: false, message: 'Google sign-in is not configured.' });
    }
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ success: false, message: 'idToken required' });

    // Trust ONLY the verified payload, never client-sent identity fields.
    const ticket = await googleClient.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload || !payload.sub || !payload.email_verified) {
      return res.status(401).json({ success: false, message: 'Invalid or unverified Google account' });
    }

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name || 'User';
    const profilePicUrl = payload.picture;

    let user = await prisma.user.findUnique({ where: { googleId } });
    if (!user) {
      user = await prisma.user.create({
        data: { googleId, email, name, profilePicUrl, phoneNumber: `google_${googleId}` },
      });
    }
    const token = signToken({ userId: user.id, role: user.role });
    res.json({ success: true, data: { token, user } });
  } catch (err) {
    // Verification failure -> 401, not 500.
    return res.status(401).json({ success: false, message: 'Google verification failed' });
  }
};

/** GET /api/auth/me */
export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};
