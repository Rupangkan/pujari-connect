/**
 * Booking Draft — the in-progress puja/pujari booking carried through the
 * address -> payment flow (separate from the samagri cart).
 */
import { create } from 'zustand';

export interface BookingDraft {
  kind: 'puja' | 'pujari';
  pujaId?: string;
  pujariId?: string;
  packageId?: string;     // real DB id (puja packages only)
  title: string;          // puja name or pujari name
  subtitle?: string;      // package / ceremony name
  offeringIds: string[];
  notes?: string;
  total: number;
  addressId?: string;
  addressText?: string;
}

interface DraftState {
  draft: BookingDraft | null;
  setDraft: (d: BookingDraft) => void;
  setAddress: (id: string, text?: string) => void;
  clear: () => void;
}

export const useBookingDraft = create<DraftState>((set) => ({
  draft: null,
  setDraft: (d) => set({ draft: d }),
  setAddress: (id, text) => set((s) => (s.draft ? { draft: { ...s.draft, addressId: id, addressText: text } } : s)),
  clear: () => set({ draft: null }),
}));
