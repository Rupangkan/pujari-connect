/**
 * Samagri Service — Puja materials listing and ordering
 */

import api from '@/services/api';
import { SamagriItem, ApiResponse } from '@/types';

interface SamagriOrderItem {
  itemId: string;
  quantity: number;
}

interface SamagriOrder {
  id: string;
  items: SamagriOrderItem[];
  totalAmount: number;
  deliveryFee: number;
  addressId: string;
  status: string;
  createdAt: string;
}

export const samagriService = {
  /** Get all samagri items, optionally filtered by category */
  getAll: (category?: string) =>
    api.get<ApiResponse<SamagriItem[]>>('/samagri', {
      params: category ? { category } : undefined,
    }),

  /** Place a samagri order */
  placeOrder: (items: SamagriOrderItem[], addressId: string) =>
    api.post<ApiResponse<SamagriOrder>>('/samagri/order', { items, addressId }),
};
