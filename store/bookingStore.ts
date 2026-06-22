/**
 * Booking Store — Zustand store for the booking flow wizard
 */

import { create } from 'zustand';
import { Puja, Package, Offering, KitItem } from '@/types';

interface SelectedKitItem {
  item: KitItem;
  quantity: number;
}

interface BookingState {
  selectedPuja: Puja | null;
  selectedPackage: Package | null;
  selectedOfferings: Offering[];
  selectedKitItems: SelectedKitItem[];
  selectedDate: Date | null;
  couponCode: string;
  discount: number;
  addressId: string;

  /** Set the selected puja */
  setPuja: (puja: Puja) => void;

  /** Set the selected package */
  setPackage: (pkg: Package | null) => void;

  /** Toggle an offering (add if not selected, remove if selected) */
  toggleOffering: (offering: Offering) => void;

  /** Set quantity for a kit item (adds if not present, removes if quantity is 0) */
  setKitQuantity: (kitItemId: string, quantity: number) => void;

  /** Set the selected date */
  setDate: (date: Date | null) => void;

  /** Apply a coupon code (sets the code; discount is calculated server-side) */
  applyCoupon: (code: string) => void;

  /** Set the delivery address */
  setAddress: (id: string) => void;

  /** Compute subtotal from package + offerings + kit items */
  getSubtotal: () => number;

  /** Compute total after discount */
  getTotal: () => number;

  /** Reset the entire booking state */
  reset: () => void;
}

const initialState = {
  selectedPuja: null,
  selectedPackage: null,
  selectedOfferings: [] as Offering[],
  selectedKitItems: [] as SelectedKitItem[],
  selectedDate: null,
  couponCode: '',
  discount: 0,
  addressId: '',
};

export const useBookingStore = create<BookingState>((set, get) => ({
  ...initialState,

  setPuja: (puja: Puja) => {
    set({ selectedPuja: puja });
  },

  setPackage: (pkg: Package | null) => {
    set({ selectedPackage: pkg });
  },

  toggleOffering: (offering: Offering) => {
    set((state) => {
      const exists = state.selectedOfferings.some((o) => o.id === offering.id);
      if (exists) {
        return {
          selectedOfferings: state.selectedOfferings.filter(
            (o) => o.id !== offering.id
          ),
        };
      }
      return {
        selectedOfferings: [...state.selectedOfferings, offering],
      };
    });
  },

  setKitQuantity: (kitItemId: string, quantity: number) => {
    set((state) => {
      if (quantity <= 0) {
        return {
          selectedKitItems: state.selectedKitItems.filter(
            (k) => k.item.id !== kitItemId
          ),
        };
      }

      const existing = state.selectedKitItems.find(
        (k) => k.item.id === kitItemId
      );
      if (existing) {
        return {
          selectedKitItems: state.selectedKitItems.map((k) =>
            k.item.id === kitItemId ? { ...k, quantity } : k
          ),
        };
      }

      // Item not yet in list — find it from the puja's kit items
      const pujaKitItem = state.selectedPuja?.kitItems?.find(
        (k) => k.id === kitItemId
      );
      if (!pujaKitItem) return state;

      return {
        selectedKitItems: [
          ...state.selectedKitItems,
          { item: pujaKitItem, quantity },
        ],
      };
    });
  },

  setDate: (date: Date | null) => {
    set({ selectedDate: date });
  },

  applyCoupon: (code: string) => {
    set({ couponCode: code });
  },

  setAddress: (id: string) => {
    set({ addressId: id });
  },

  getSubtotal: () => {
    const { selectedPackage, selectedOfferings, selectedKitItems } = get();

    const packagePrice = selectedPackage?.price ?? 0;
    const offeringsTotal = selectedOfferings.reduce(
      (sum, o) => sum + o.price,
      0
    );
    const kitTotal = selectedKitItems.reduce(
      (sum, k) => sum + k.item.price * k.quantity,
      0
    );

    return packagePrice + offeringsTotal + kitTotal;
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const { discount } = get();
    return Math.max(0, subtotal - discount);
  },

  reset: () => {
    set(initialState);
  },
}));
