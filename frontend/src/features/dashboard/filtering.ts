import type { FillUpEntry } from '../fillups/types';

export type DateRange = 'all' | '30days' | '90days' | 'year';
export type SortOrder = 'newest' | 'oldest';

export function filterByDateRange(entries: FillUpEntry[], range: DateRange): FillUpEntry[] {
  if (range === 'all') return entries;
  
  const now = Date.now();
  const msPerDay = 24 * 60 * 60 * 1000;
  
  let cutoffTime: number;
  if (range === '30days') {
    cutoffTime = now - (30 * msPerDay);
  } else if (range === '90days') {
    cutoffTime = now - (90 * msPerDay);
  } else { // 'year'
    const currentYear = new Date().getFullYear();
    cutoffTime = new Date(currentYear, 0, 1).getTime();
  }
  
  // Filter entries, keeping those with valid timestamps >= cutoff
  return entries.filter(entry => {
    // Keep entries with valid timestamps that meet the cutoff
    if (Number.isFinite(entry.timestamp) && entry.timestamp > 0) {
      return entry.timestamp >= cutoffTime;
    }
    // Keep entries with invalid timestamps visible (they'll show "Date unavailable")
    return true;
  });
}

export function sortEntries(entries: FillUpEntry[], order: SortOrder): FillUpEntry[] {
  const sorted = [...entries];
  sorted.sort((a, b) => {
    const aValid = Number.isFinite(a.timestamp) && a.timestamp > 0;
    const bValid = Number.isFinite(b.timestamp) && b.timestamp > 0;
    
    // Place invalid timestamps at the end regardless of sort order
    if (!aValid && !bValid) return 0;
    if (!aValid) return 1;
    if (!bValid) return -1;
    
    // Sort valid timestamps
    if (order === 'newest') {
      return b.timestamp - a.timestamp;
    } else {
      return a.timestamp - b.timestamp;
    }
  });
  return sorted;
}

export function filterFillUps(
  entries: FillUpEntry[],
  dateRange: DateRange,
  sortOrder: SortOrder
): FillUpEntry[] {
  const filtered = filterByDateRange(entries, dateRange);
  return sortEntries(filtered, sortOrder);
}
