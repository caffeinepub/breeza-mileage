import type { FillUpEntry } from '../fillups/types';

export type DateRange = 'all' | '30days' | '90days' | 'year';
export type SortOrder = 'newest' | 'oldest';

export function filterByDateRange(entries: FillUpEntry[], range: DateRange): FillUpEntry[] {
  if (range === 'all') return entries;
  
  // Since we don't have dates in backend, we'll use entry count as a proxy
  const limit = range === '30days' ? 30 : range === '90days' ? 90 : 365;
  return entries.slice(-limit);
}

export function sortEntries(entries: FillUpEntry[], order: SortOrder): FillUpEntry[] {
  const sorted = [...entries];
  if (order === 'newest') {
    return sorted.reverse();
  }
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
