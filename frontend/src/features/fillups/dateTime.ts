/**
 * Validates whether a timestamp can be converted to a valid Date
 */
export function isValidTimestamp(timestamp: number): boolean {
  return Number.isFinite(timestamp) && timestamp > 0 && !isNaN(new Date(timestamp).getTime());
}

/**
 * Formats a timestamp (epoch milliseconds) to English locale date/time string
 * Returns "Date unavailable" if timestamp is invalid
 */
export function formatDateTime(timestamp: number): string {
  if (!isValidTimestamp(timestamp)) {
    return 'Date unavailable';
  }
  
  const date = new Date(timestamp);
  
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}
