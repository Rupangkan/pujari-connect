/**
 * Cart Store — Zustand store for samagri shopping cart
 */

import { create } from 'zustand';
import { SamagriItem, CartSamagriItem } from '@/types';

interface CartState {
  items: CartSamagriItem[];

  /** Add an item to the cart (increments quantity if already present) */
  addItem: (item: SamagriItem) => void;

  /** Remove an item from the cart */
  removeItem: (id: string) => void;

  /** Update the quantity of a cart item */
  updateQuantity: (id: string, quantity: number) => void;

  /** Clear all items from the cart */
  clearCart: () => void;

  /** Get the total price of all items */
  getTotal: () => number;

  /** Get the total number of items in the cart */
  getItemCount: () => number;

  /** Get the delivery fee (₹50 if total < ₹500, else free) */
  getDeliveryFee: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item: SamagriItem) => {
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, cartQuantity: i.cartQuantity + 1 } : i
          ),
        };
      }
      return {
        items: [...state.items, { ...item, cartQuantity: 1 }],
      };
    });
  },

  removeItem: (id: string) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    }));
  },

  updateQuantity: (id: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, cartQuantity: quantity } : i
      ),
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  getTotal: () => {
    return get().items.reduce(
      (total, item) => total + item.price * item.cartQuantity,
      0
    );
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.cartQuantity, 0);
  },

  getDeliveryFee: () => {
    const total = get().getTotal();
    return total < 500 ? 50 : 0;
  },
}));
