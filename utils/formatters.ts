/**
 * Formatters — Utility functions for display formatting
 */

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;

/**
 * Format a price in Indian Rupees.
 * @example formatPrice(1500) → '₹1,500'
 * @example formatPrice(100000) → '₹1,00,000'
 */
export const formatPrice = (amount: number): string => {
  const formatted = amount.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    useGrouping: true,
  });
  return `₹${formatted}`;
};

/**
 * Format a date as 'DD Mon YYYY'.
 * @example formatDate('2025-02-15T10:00:00Z') → '15 Feb 2025'
 * @example formatDate(new Date(2025, 1, 15)) → '15 Feb 2025'
 */
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = d.getDate();
  const month = MONTHS[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

/**
 * Format a duration given in minutes to a human-readable string.
 * @example formatDuration(150) → '2h 30m'
 * @example formatDuration(60)  → '1h'
 * @example formatDuration(45)  → '45m'
 */
export const formatDuration = (minutes: number): string => {
  if (minutes <= 0) return '0m';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

/**
 * Format a rating to one decimal place.
 * @example formatRating(4.8333) → '4.8'
 * @example formatRating(5)      → '5.0'
 */
export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

/**
 * Truncate text to a maximum length, appending '…' if truncated.
 * @example truncateText('Hello World', 5) → 'Hello…'
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
};
