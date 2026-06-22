/**
 * Auth Store — Zustand store for authentication state (in-memory)
 */

import { create } from 'zustand';
import { User } from '@/types';
import { authService } from '@/services/auth.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  /** Send OTP to phone number */
  login: (phone: string) => Promise<void>;

  /** Verify OTP and authenticate */
  verifyOtp: (phone: string, otp: string) => Promise<void>;

  /** Sign in with Google */
  googleSignIn: (idToken: string) => Promise<void>;

  /** Log out and clear state */
  logout: () => void;

  /** Load user from token (if token exists) */
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (phone: string) => {
    set({ isLoading: true });
    try {
      await authService.sendOtp(phone);
    } finally {
      set({ isLoading: false });
    }
  },

  verifyOtp: async (phone: string, otp: string) => {
    set({ isLoading: true });
    try {
      const response = await authService.verifyOtp(phone, otp);
      const { token, user } = response.data.data;
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  googleSignIn: async (idToken: string) => {
    set({ isLoading: true });
    try {
      const response = await authService.googleSignIn(idToken);
      const { token, user } = response.data.data;
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  loadUser: async () => {
    const { token } = get();
    if (!token) return;

    set({ isLoading: true });
    try {
      const response = await authService.getMe();
      set({
        user: response.data.data,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      // Token invalid — clear state
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
