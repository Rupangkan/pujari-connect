import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error.middleware.js';

const prisma = new PrismaClient();

// ─── Profile ──────────────────────────────────────────────────────────

interface UpdateProfileData {
  name?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  profilePicUrl?: string;
}

/**
 * Update user profile
 */
export async function updateProfile(userId: string, data: UpdateProfileData) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.dateOfBirth !== undefined && { dateOfBirth: data.dateOfBirth }),
      ...(data.gender !== undefined && { gender: data.gender }),
      ...(data.profilePicUrl !== undefined && { profilePicUrl: data.profilePicUrl }),
    },
  });

  return {
    id: updatedUser.id,
    phoneNumber: updatedUser.phoneNumber,
    name: updatedUser.name,
    email: updatedUser.email,
    profilePicUrl: updatedUser.profilePicUrl,
    dateOfBirth: updatedUser.dateOfBirth,
    gender: updatedUser.gender,
    role: updatedUser.role,
  };
}

// ─── Addresses ────────────────────────────────────────────────────────

interface CreateAddressData {
  fullName: string;
  phone: string;
  pinCode: string;
  state: string;
  city: string;
  flatHouse: string;
  area: string;
  landmark?: string;
  isDefault?: boolean;
}

/**
 * Get all addresses for a user
 */
export async function getAddresses(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: 'desc' },
  });
}

/**
 * Create a new address
 */
export async function createAddress(userId: string, data: CreateAddressData) {
  // If this is set as default, unset all other defaults
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  return prisma.address.create({
    data: {
      userId,
      fullName: data.fullName,
      phone: data.phone,
      pinCode: data.pinCode,
      state: data.state,
      city: data.city,
      flatHouse: data.flatHouse,
      area: data.area,
      landmark: data.landmark || null,
      isDefault: data.isDefault || false,
    },
  });
}

/**
 * Delete an address
 */
export async function deleteAddress(userId: string, addressId: string) {
  const address = await prisma.address.findUnique({ where: { id: addressId } });

  if (!address) {
    throw new AppError('Address not found.', 404);
  }

  if (address.userId !== userId) {
    throw new AppError('You do not have permission to delete this address.', 403);
  }

  await prisma.address.delete({ where: { id: addressId } });
  return { message: 'Address deleted successfully.' };
}

// ─── Wishlist ─────────────────────────────────────────────────────────

/**
 * Get user's wishlist
 */
export async function getWishlist(userId: string) {
  return prisma.wishlist.findMany({
    where: { userId },
    include: {
      puja: {
        select: {
          id: true,
          name: true,
          basePrice: true,
          category: true,
          location: true,
          imageUrl: true,
          type: true,
          duration: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Add a puja to wishlist
 */
export async function addToWishlist(userId: string, pujaId: string) {
  // Verify puja exists
  const puja = await prisma.puja.findUnique({ where: { id: pujaId } });
  if (!puja) {
    throw new AppError('Puja not found.', 404);
  }

  // Check if already in wishlist
  const existing = await prisma.wishlist.findUnique({
    where: { userId_pujaId: { userId, pujaId } },
  });

  if (existing) {
    throw new AppError('Puja is already in your wishlist.', 400);
  }

  return prisma.wishlist.create({
    data: { userId, pujaId },
    include: {
      puja: {
        select: { id: true, name: true, basePrice: true, category: true },
      },
    },
  });
}

/**
 * Remove a puja from wishlist
 */
export async function removeFromWishlist(userId: string, pujaId: string) {
  const existing = await prisma.wishlist.findUnique({
    where: { userId_pujaId: { userId, pujaId } },
  });

  if (!existing) {
    throw new AppError('Puja is not in your wishlist.', 404);
  }

  await prisma.wishlist.delete({
    where: { userId_pujaId: { userId, pujaId } },
  });

  return { message: 'Puja removed from wishlist.' };
}
