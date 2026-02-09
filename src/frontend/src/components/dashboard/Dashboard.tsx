import { useState } from 'react';
import { useGetFillUps } from '../../features/fillups/useFillUps';
import { applyFilters, type DateRange, type SortOrder } from '../../features/dashboard/filtering';
import FillUpForm from '../fillups/FillUpForm';
import MileageStats from '../fillups/MileageStats';
import FillUpList from './FillUpList';
import FiltersBar from './FiltersBar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const { data: fillUps, isLoading, error } = useGetFillUps();
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load fill-ups. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredEntries = fillUps ? applyFilters(fillUps, dateRange, sortOrder) : [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Breeza Mileage</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {fillUps && fillUps.length > 0 
              ? `${fillUps.length} fill-up${fillUps.length === 1 ? '' : 's'} recorded`
              : 'Start tracking your fuel efficiency'}
          </p>
        </div>
        <FillUpForm />
      </div>

      {/* Stats */}
      {fillUps && fillUps.length > 0 && (
        <MileageStats />
      )}

      {/* Filters */}
      {fillUps && fillUps.length > 0 && (
        <FiltersBar
          dateRange={dateRange}
          sortOrder={sortOrder}
          onDateRangeChange={setDateRange}
          onSortOrderChange={setSortOrder}
        />
      )}

      {/* Fill-up List */}
      <FillUpList entries={filteredEntries} />
    </div>
  );
}
