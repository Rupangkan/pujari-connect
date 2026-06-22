import { PrismaClient } from '@prisma/client';
import { signToken, generateOTP } from '../utils/helpers.js';
import { AppError } from '../middleware/error.middleware.js';

const prisma = new PrismaClient();

// In-memory OTP store (in production, use Redis or similar)
const otpStore = new Map<string, { otp: string; expiresAt: Date }>();

/**
 * Send OTP to phone number (mock implementation for dev)
 */
export async function sendOTP(phoneNumber: string): Promise<{ message: string }> {
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  otpStore.set(phoneNumber, { otp, expiresAt });

  console.log(`[DEV] OTP for ${phoneNumber}: ${otp}`);

  return { message: `OTP sent to ${phoneNumber}. In development, OTP is always 123456.` };
}

/**
 * Verify OTP and return JWT token
 */
export async function verifyOTP(
  phoneNumber: string,
  otp: string,
  name?: string
): Promise<{ token: string; user: Record<string, unknown>; isNewUser: boolean }> {
  const stored = otpStore.get(phoneNumber);

  // In dev mode, always accept '123456'
  if (process.env.NODE_ENV !== 'production' && otp === '123456') {
    // OK - always valid in dev
  } else if (!stored) {
    throw new AppError('OTP not found. Please request a new OTP.', 400);
  } else if (stored.otp !== otp) {
    throw new AppError('Invalid OTP. Please try again.', 400);
  } else if (stored.expiresAt < new Date()) {
    otpStore.delete(phoneNumber);
    throw new AppError('OTP has expired. Please request a new one.', 400);
  }

  // Clean up used OTP
  otpStore.delete(phoneNumber);

  // Find or create user
  let user = await prisma.user.findUnique({
    where: { phoneNumber },
  });

  let isNewUser = false;

  if (!user) {
    isNewUser = true;
    user = await prisma.user.create({
      data: {
        phoneNumber,
        name: name || `User ${phoneNumber.slice(-4)}`,
        role: 'USER',
      },
    });
  }

  const token = signToken({ userId: user.id, role: user.role });

  return {
    token,
    user: {
      id: user.id,
      phoneNumber: user.phoneNumber,
      name: user.name,
      email: user.email,
      profilePicUrl: user.profilePicUrl,
      role: user.role,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
    },
    isNewUser,
  };
}

/**
 * Google sign-in (mock implementation)
 */
export async function googleSignIn(
  googleId: string,
  name: string,
  email: string,
  profilePicUrl?: string
): Promise<{ token: string; user: Record<string, unknown>; isNewUser: boolean }> {
  let user = await prisma.user.findUnique({
    where: { googleId },
  });

  let isNewUser = false;

  if (!user) {
    // Check if a user with the same email exists
    const existingUser = email
      ? await prisma.user.findFirst({ where: { email } })
      : null;

    if (existingUser) {
      // Link Google account to existing user
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: { googleId, profilePicUrl },
      });
    } else {
      isNewUser = true;
      user = await prisma.user.create({
        data: {
          phoneNumber: `google_${googleId}`, // Placeholder until phone is verified
          googleId,
          name,
          email,
          profilePicUrl,
          role: 'USER',
        },
      });
    }
  }

  const token = signToken({ userId: user.id, role: user.role });

  return {
    token,
    user: {
      id: user.id,
      phoneNumber: user.phoneNumber,
      googleId: user.googleId,
      name: user.name,
      email: user.email,
      profilePicUrl: user.profilePicUrl,
      role: user.role,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
    },
    isNewUser,
  };
}

/**
 * Get current user profile
 */
export async function getCurrentUser(userId: string): Promise<Record<string, unknown>> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      addresses: true,
      _count: {
        select: {
          bookings: true,
          wishlists: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  return {
    id: user.id,
    phoneNumber: user.phoneNumber,
    googleId: user.googleId,
    name: user.name,
    email: user.email,
    profilePicUrl: user.profilePicUrl,
    role: user.role,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    addresses: user.addresses,
    totalBookings: user._count.bookings,
    totalWishlistItems: user._count.wishlists,
    createdAt: user.createdAt,
  };
}
