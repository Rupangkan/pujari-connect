/**
 * API Client — Axios instance with interceptors
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { config } from '@/constants/config';
import { useAuthStore } from '@/store/authStore';

const api = axios.create({
  baseURL: `${config.API_BASE_URL}/api`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (reqConfig: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token && reqConfig.headers) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }
    return reqConfig;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor — handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — logout
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
