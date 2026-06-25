/**
 * Mappers / formatters between API models and UI shapes.
 */
import type { Puja, EventCard } from '@/types';

/** Format a number as Indian Rupees, e.g. 5100 -> "₹5,100". */
export function formatINR(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
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
