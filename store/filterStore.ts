/**
 * Filter Store — Zustand store for puja and pujari filter state
 */

import { create } from 'zustand';
import { PujaFilters, PujariFilters } from '@/types';

interface FilterState {
  pujaFilters: PujaFilters;
  pujariFilters: PujariFilters;

  /** Update a single field in puja filters */
  setPujaFilter: <K extends keyof PujaFilters>(key: K, value: PujaFilters[K]) => void;

  /** Update a single field in pujari filters */
  setPujariFilter: <K extends keyof PujariFilters>(key: K, value: PujariFilters[K]) => void;

  /** Clear all puja filters */
  clearPujaFilters: () => void;

  /** Clear all pujari filters */
  clearPujariFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  pujaFilters: {},
  pujariFilters: {},

  setPujaFilter: (key, value) => {
    set((state) => ({
      pujaFilters: { ...state.pujaFilters, [key]: value },
    }));
  },

  setPujariFilter: (key, value) => {
    set((state) => ({
      pujariFilters: { ...state.pujariFilters, [key]: value },
    }));
  },

  clearPujaFilters: () => {
    set({ pujaFilters: {} });
  },

  clearPujariFilters: () => {
    set({ pujariFilters: {} });
  },
}));
