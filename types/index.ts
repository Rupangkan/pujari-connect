/**
 * Pujari Connect — TypeScript Type Definitions
 */

// ─── Enums ──────────────────────────────────────

export type PujaType = 'ONLINE' | 'OFFLINE' | 'BOTH';
export type PujaCategory = 'HOME' | 'PERSONAL' | 'FESTIVAL' | 'TEMPLE' | 'ANCESTRAL';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type UserRole = 'USER' | 'ADMIN' | 'PUJARI';
export type SortOption = 'featured' | 'rating' | 'price_low' | 'price_high' | 'experience' | 'bookings' | 'newest';

// ─── Core Models ────────────────────────────────

export interface User {
  id: string;
  phoneNumber: string;
  googleId?: string;
  name: string;
  email?: string;
  profilePicUrl?: string;
  role: UserRole;
  dateOfBirth?: string;
  gender?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Puja {
  id: string;
  name: string;
  description: string;
  aboutPuja: string;
  type: PujaType;
  duration: number; // minutes
  dateTime: string;
  basePrice: number;
  imageUrl?: string;
  images: string[];
  category: PujaCategory;
  location: string;
  isActive: boolean;
  packages?: Package[];
  faqs?: FAQ[];
  kitItems?: KitItem[];
  offerings?: Offering[];
}

export interface Pujari {
  id: string;
  name: string;
  experience: number;
  ethnicity: string;
  specialization: string;
  phone: string;
  email: string;
  location: string;
  rating: number;
  totalBookings: number;
  hourlyRate: number;
  bio: string;
  languages: string;
  imageUrl?: string;
  isVerified: boolean;
}

export interface SamagriItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  imageUrl?: string;
  inStock: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  pujaId: string;
  pujariId?: string;
  status: BookingStatus;
  bookingDate: string;
  totalAmount: number;
  paymentId?: string;
  paymentStatus: PaymentStatus;
  couponCode?: string;
  discount: number;
  addressId?: string;
  notes?: string;
  createdAt: string;
  puja?: Puja;
  pujari?: Pujari;
  address?: Address;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  pinCode: string;
  state: string;
  city: string;
  flatHouse: string;
  area: string;
  landmark?: string;
  isDefault: boolean;
}

export interface Package {
  id: string;
  pujaId: string;
  title: string;
  price: number;
  coupon?: string;
  isPopular: boolean;
  details: PackageDetail[];
}

export interface PackageDetail {
  id: string;
  heading: string;
  label: string;
  items: string[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface KitItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  isOptional: boolean;
  category: string;
}

export interface Offering {
  id: string;
  name: string;
  price: number;
}

// ─── Event Card (for carousels) ─────────────────

export interface EventCard {
  id?: string;
  title: string;
  dateTime: string;
  venue: string;
  price: string;
  discountText?: string;
  imageUrl?: string;
  pujaId?: string;
}

// ─── Cart ───────────────────────────────────────

export interface CartSamagriItem extends SamagriItem {
  cartQuantity: number;
}

export interface BookingCart {
  puja: Puja;
  selectedPackage?: Package;
  selectedOfferings: Offering[];
  selectedKitItems: { item: KitItem; quantity: number }[];
  selectedDate?: Date;
  couponCode?: string;
  discount: number;
  addressId?: string;
}

// ─── API Response ───────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Filter Types ───────────────────────────────

export interface PujaFilters {
  category?: PujaCategory;
  type?: PujaType;
  priceMin?: number;
  priceMax?: number;
  durationMin?: number;
  durationMax?: number;
  location?: string;
  search?: string;
  sort?: SortOption;
}

export interface PujariFilters {
  ethnicity?: string;
  ratingMin?: number;
  ratingMax?: number;
  experienceMin?: number;
  experienceMax?: number;
  location?: string;
  search?: string;
  sort?: SortOption;
}
