/**
 * Mappers / formatters between API models and UI shapes.
 */
import type { Puja, EventCard } from '@/types';

/** Format a number as Indian Rupees, e.g. 5100 -> "₹5,100". */
export function formatINR(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

/** Format a phone number for display, e.g. "9876543210" -> "+91 98765 43210". */
export function formatPhone(phone?: string): string {
  if (!phone) return '';
  if (phone.startsWith('+')) return phone;
  const d = phone.replace(/\D/g, '');
  if (d.length === 10) return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
  return phone;
}

/** Map an API Puja to the EventCard shape used by the card components. */
export function pujaToEvent(puja: Puja): EventCard {
  return {
    id: puja.id,
    pujaId: puja.id,
    title: puja.name,
    dateTime: puja.dateTime,
    venue: puja.location,
    price: formatINR(puja.basePrice),
    imageUrl: puja.imageUrl,
  };
}
