import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ArrowUpDown } from 'lucide-react';
import type { DateRange, SortOrder } from '../../features/dashboard/filtering';

interface FiltersBarProps {
  dateRange: DateRange;
  sortOrder: SortOrder;
  onDateRangeChange: (range: DateRange) => void;
  onSortOrderChange: (order: SortOrder) => void;
}

export default function FiltersBar({
  dateRange,
  sortOrder,
  onDateRangeChange,
  onSortOrderChange,
}: FiltersBarProps) {
  return (
    <div className="bg-surface-subtle border border-border rounded-lg p-4 mb-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Show:</span>
          <Select value={dateRange} onValueChange={(value: DateRange) => onDateRangeChange(value)}>
            <SelectTrigger className="w-full sm:w-[180px] bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entries</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground whitespace-nowrap">Sort:</span>
          <ToggleGroup
            type="single"
            value={sortOrder}
            onValueChange={(value: SortOrder) => value && onSortOrderChange(value)}
            className="bg-background rounded-md"
          >
            <ToggleGroupItem value="newest" aria-label="Newest first" className="text-sm">
              Newest
            </ToggleGroupItem>
            <ToggleGroupItem value="oldest" aria-label="Oldest first" className="text-sm">
              Oldest
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
}
