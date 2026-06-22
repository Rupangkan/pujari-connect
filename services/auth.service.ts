/**
 * Auth Service — Authentication API calls
 */

import api from '@/services/api';
import { User, ApiResponse } from '@/types';

export const authService = {
  /** Send OTP to phone number */
  sendOtp: (phoneNumber: string) =>
    api.post<ApiResponse<{ message: string }>>('/auth/send-otp', { phoneNumber }),

  /** Verify OTP and get auth token */
  verifyOtp: (phoneNumber: string, otp: string) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/verify-otp', {
      phoneNumber,
      otp,
    }),

  /** Sign in with Google ID token */
  googleSignIn: (idToken: string) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/google', {
      idToken,
    }),

  /** Get current authenticated user */
  getMe: () => api.get<ApiResponse<User>>('/auth/me'),
};
