/**
 * User Service — Profile, addresses, and wishlist management
 */

import api from '@/services/api';
import { User, Address, Puja, ApiResponse } from '@/types';

export const userService = {
  /** Update user profile */
  updateProfile: (data: Partial<User>) =>
    api.patch<ApiResponse<User>>('/users/profile', data),

  /** Get all saved addresses */
  getAddresses: () =>
    api.get<ApiResponse<Address[]>>('/users/addresses'),

  /** Add a new address */
  addAddress: (data: Omit<Address, 'id' | 'userId'>) =>
    api.post<ApiResponse<Address>>('/users/addresses', data),

  /** Delete an address by ID */
  deleteAddress: (id: string) =>
    api.delete<ApiResponse<{ message: string }>>(`/users/addresses/${id}`),

  /** Get user's wishlist of pujas */
  getWishlist: () =>
    api.get<ApiResponse<Puja[]>>('/users/wishlist'),

  /** Toggle a puja in the wishlist (add if absent, remove if present) */
  toggleWishlist: (pujaId: string) =>
    api.post<ApiResponse<{ wishlisted: boolean }>>(`/users/wishlist/${pujaId}`),
};
