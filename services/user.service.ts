/**
 * User Service — Profile, addresses, and wishlist management
 */

import api from '@/services/api';
import { User, Address, Puja, ApiResponse } from '@/types';

export const userService = {
  /** Update user profile */
  updateProfile: (data: Partial<User>) =>
    api.patch<ApiResponse<User>>('/user/profile', data),

  /** Get all saved addresses */
  getAddresses: () =>
    api.get<ApiResponse<Address[]>>('/user/addresses'),

  /** Add a new address */
  addAddress: (data: Omit<Address, 'id' | 'userId'>) =>
    api.post<ApiResponse<Address>>('/user/addresses', data),

  /** Delete an address by ID */
  deleteAddress: (id: string) =>
    api.delete<ApiResponse<{ message: string }>>(`/user/addresses/${id}`),

  /** Get user's wishlist of pujas */
  getWishlist: () =>
    api.get<ApiResponse<Puja[]>>('/user/wishlist'),

  /** Toggle a puja in the wishlist (add if absent, remove if present) */
  toggleWishlist: (pujaId: string) =>
    api.post<ApiResponse<{ wishlisted: boolean }>>(`/user/wishlist/${pujaId}`),
};
