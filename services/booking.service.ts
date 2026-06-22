/**
 * Booking Service — Booking CRUD and payment operations
 */

import api from '@/services/api';
import { Booking, BookingCart, ApiResponse } from '@/types';

interface PaymentVerificationData {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

interface PaymentInitResponse {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
}

export const bookingService = {
  /** Create a new booking */
  create: (data: BookingCart) =>
    api.post<ApiResponse<Booking>>('/bookings', data),

  /** Get all bookings for the current user */
  getAll: () =>
    api.get<ApiResponse<Booking[]>>('/bookings'),

  /** Get a single booking by ID */
  getById: (id: string) =>
    api.get<ApiResponse<Booking>>(`/bookings/${id}`),

  /** Cancel a booking */
  cancel: (id: string) =>
    api.patch<ApiResponse<Booking>>(`/bookings/${id}/cancel`),

  /** Initiate payment for a booking (creates Razorpay order) */
  initiatePayment: (id: string) =>
    api.post<ApiResponse<PaymentInitResponse>>(`/bookings/${id}/payment/initiate`),

  /** Verify payment after Razorpay callback */
  verifyPayment: (id: string, paymentData: PaymentVerificationData) =>
    api.post<ApiResponse<Booking>>(`/bookings/${id}/payment/verify`, paymentData),
};
