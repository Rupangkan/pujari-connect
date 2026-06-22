// ─── Admin Resource Registry ──────────────────────────────────────────────
// Single source of truth for the admin panel. Each entry maps a URL key to a
// Prisma model delegate and describes its editable fields. The same metadata
// drives backend whitelisting/coercion AND the auto-generated frontend forms.

export type FieldType = 'string' | 'text' | 'number' | 'boolean' | 'datetime' | 'select';

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];   // for `select`
  listVisible?: boolean; // shown as a column in the list table
  help?: string;
}

export interface ResourceDef {
  key: string;                                  // url + nav key (e.g. "pujas")
  label: string;                                // display name
  model: string;                                // Prisma client delegate name
  orderBy?: Record<string, 'asc' | 'desc'>;     // default list ordering
  searchField?: string;                         // field used by the `q` filter
  include?: Record<string, unknown>;            // Prisma include for read ops
  fields: FieldDef[];
}

export const resources: ResourceDef[] = [
  {
    key: 'pujas',
    label: 'Pujas',
    model: 'puja',
    orderBy: { createdAt: 'desc' },
    searchField: 'name',
    fields: [
      { name: 'name', label: 'Name', type: 'string', required: true, listVisible: true },
      { name: 'category', label: 'Category', type: 'select', required: true, listVisible: true, options: ['HOME', 'PERSONAL', 'FESTIVAL', 'TEMPLE', 'ANCESTRAL'] },
      { name: 'type', label: 'Type', type: 'select', required: true, listVisible: true, options: ['ONLINE', 'OFFLINE', 'BOTH'] },
      { name: 'basePrice', label: 'Base Price', type: 'number', required: true, listVisible: true },
      { name: 'duration', label: 'Duration (min)', type: 'number', required: true },
      { name: 'dateTime', label: 'Date / Time', type: 'string', required: true },
      { name: 'location', label: 'Location', type: 'string', required: true },
      { name: 'description', label: 'Description', type: 'text', required: true },
      { name: 'aboutPuja', label: 'About Puja', type: 'text', required: true },
      { name: 'imageUrl', label: 'Image URL', type: 'string' },
      { name: 'isActive', label: 'Active', type: 'boolean', listVisible: true },
    ],
  },
  {
    key: 'pujaris',
    label: 'Pujaris',
    model: 'pujari',
    orderBy: { createdAt: 'desc' },
    searchField: 'name',
    fields: [
      { name: 'name', label: 'Name', type: 'string', required: true, listVisible: true },
      { name: 'specialization', label: 'Specialization', type: 'string', required: true, listVisible: true },
      { name: 'experience', label: 'Experience (yrs)', type: 'number', required: true, listVisible: true },
      { name: 'ethnicity', label: 'Ethnicity', type: 'string', required: true },
      { name: 'phone', label: 'Phone', type: 'string', required: true },
      { name: 'email', label: 'Email', type: 'string', required: true },
      { name: 'location', label: 'Location', type: 'string', required: true, listVisible: true },
      { name: 'hourlyRate', label: 'Hourly Rate', type: 'number', required: true, listVisible: true },
      { name: 'rating', label: 'Rating', type: 'number' },
      { name: 'totalBookings', label: 'Total Bookings', type: 'number' },
      { name: 'languages', label: 'Languages', type: 'string', required: true, help: 'Comma separated' },
      { name: 'bio', label: 'Bio', type: 'text', required: true },
      { name: 'imageUrl', label: 'Image URL', type: 'string' },
      { name: 'isVerified', label: 'Verified', type: 'boolean', listVisible: true },
      { name: 'isActive', label: 'Active', type: 'boolean' },
    ],
  },
  {
    key: 'samagri',
    label: 'Samagri Items',
    model: 'samagriItem',
    orderBy: { category: 'asc' },
    searchField: 'name',
    fields: [
      { name: 'name', label: 'Name', type: 'string', required: true, listVisible: true },
      { name: 'category', label: 'Category', type: 'string', required: true, listVisible: true },
      { name: 'price', label: 'Price', type: 'number', required: true, listVisible: true },
      { name: 'unit', label: 'Unit', type: 'string', required: true, listVisible: true },
      { name: 'description', label: 'Description', type: 'text', required: true },
      { name: 'imageUrl', label: 'Image URL', type: 'string' },
      { name: 'inStock', label: 'In Stock', type: 'boolean', listVisible: true },
    ],
  },
  {
    key: 'users',
    label: 'Users',
    model: 'user',
    orderBy: { createdAt: 'desc' },
    searchField: 'name',
    fields: [
      { name: 'name', label: 'Name', type: 'string', required: true, listVisible: true },
      { name: 'phoneNumber', label: 'Phone Number', type: 'string', required: true, listVisible: true },
      { name: 'email', label: 'Email', type: 'string', listVisible: true },
      { name: 'role', label: 'Role', type: 'select', required: true, listVisible: true, options: ['USER', 'ADMIN', 'PUJARI'] },
      { name: 'dateOfBirth', label: 'Date of Birth', type: 'string' },
      { name: 'gender', label: 'Gender', type: 'string' },
      { name: 'profilePicUrl', label: 'Profile Pic URL', type: 'string' },
    ],
  },
  {
    key: 'bookings',
    label: 'Bookings',
    model: 'booking',
    orderBy: { createdAt: 'desc' },
    fields: [
      { name: 'userId', label: 'User ID', type: 'string', required: true },
      { name: 'pujaId', label: 'Puja ID', type: 'string', required: true },
      { name: 'pujariId', label: 'Pujari ID', type: 'string' },
      { name: 'packageId', label: 'Package ID', type: 'string' },
      { name: 'addressId', label: 'Address ID', type: 'string' },
      { name: 'bookingDate', label: 'Booking Date', type: 'datetime', required: true, listVisible: true },
      { name: 'totalAmount', label: 'Total Amount', type: 'number', required: true, listVisible: true },
      { name: 'status', label: 'Status', type: 'select', required: true, listVisible: true, options: ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] },
      { name: 'paymentStatus', label: 'Payment Status', type: 'select', required: true, listVisible: true, options: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'] },
      { name: 'paymentId', label: 'Payment ID', type: 'string' },
      { name: 'couponCode', label: 'Coupon Code', type: 'string' },
      { name: 'discount', label: 'Discount', type: 'number' },
      { name: 'notes', label: 'Notes', type: 'text' },
    ],
  },
  {
    key: 'packages',
    label: 'Packages',
    model: 'package',
    orderBy: { id: 'desc' },
    searchField: 'title',
    fields: [
      { name: 'pujaId', label: 'Puja ID', type: 'string', required: true, listVisible: true },
      { name: 'title', label: 'Title', type: 'string', required: true, listVisible: true },
      { name: 'price', label: 'Price', type: 'number', required: true, listVisible: true },
      { name: 'coupon', label: 'Coupon', type: 'string' },
      { name: 'isPopular', label: 'Popular', type: 'boolean', listVisible: true },
    ],
  },
  {
    key: 'faqs',
    label: 'FAQs',
    model: 'fAQ',
    orderBy: { id: 'desc' },
    searchField: 'question',
    fields: [
      { name: 'pujaId', label: 'Puja ID', type: 'string', required: true, listVisible: true },
      { name: 'question', label: 'Question', type: 'string', required: true, listVisible: true },
      { name: 'answer', label: 'Answer', type: 'text', required: true },
    ],
  },
  {
    key: 'kitItems',
    label: 'Kit Items',
    model: 'kitItem',
    orderBy: { id: 'desc' },
    searchField: 'name',
    fields: [
      { name: 'pujaId', label: 'Puja ID', type: 'string', required: true, listVisible: true },
      { name: 'name', label: 'Name', type: 'string', required: true, listVisible: true },
      { name: 'category', label: 'Category', type: 'string', required: true, listVisible: true },
      { name: 'quantity', label: 'Quantity', type: 'number', required: true, listVisible: true },
      { name: 'price', label: 'Price', type: 'number', required: true, listVisible: true },
      { name: 'isOptional', label: 'Optional', type: 'boolean', listVisible: true },
    ],
  },
  {
    key: 'offerings',
    label: 'Offerings',
    model: 'offering',
    orderBy: { id: 'desc' },
    searchField: 'name',
    fields: [
      { name: 'pujaId', label: 'Puja ID', type: 'string', required: true, listVisible: true },
      { name: 'name', label: 'Name', type: 'string', required: true, listVisible: true },
      { name: 'price', label: 'Price', type: 'number', required: true, listVisible: true },
    ],
  },
];

export function getResource(key: string): ResourceDef | undefined {
  return resources.find((r) => r.key === key);
}
