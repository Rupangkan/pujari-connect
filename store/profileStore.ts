/**
 * Profile Store — in-memory editable user profile (Zustand).
 * Stands in for the backend profile until auth/API is wired.
 */
import { create } from 'zustand';

export interface ProfileData {
  name: string;
  phone: string;        // auth identity — shown read-only
  email: string;
  dateOfBirth: string;  // 'YYYY-MM-DD' or ''
  gender: string;       // 'Male' | 'Female' | 'Other' | ''
}

interface ProfileState extends ProfileData {
  updateProfile: (patch: Partial<ProfileData>) => void;
  reset: () => void;
}

const DEFAULT: ProfileData = {
  name: 'Bishal Das',
  phone: '+91 99999 99999',
  email: 'bishaldas@mypujari.com',
  dateOfBirth: '1995-05-15',
  gender: 'Male',
};

export const useProfileStore = create<ProfileState>((set) => ({
  ...DEFAULT,
  updateProfile: (patch) => set((state) => ({ ...state, ...patch })),
  reset: () => set(DEFAULT),
}));
