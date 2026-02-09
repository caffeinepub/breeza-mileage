import { useState } from 'react';
import { useGetFillUps } from '../../features/fillups/useFillUps';
import { filterFillUps, type DateRange, type SortOrder } from '../../features/dashboard/filtering';
import MileageStats from '../fillups/MileageStats';
import FillUpForm from '../fillups/FillUpForm';
import FillUpList from './FillUpList';
import FiltersBar from './FiltersBar';

export default function Dashboard() {
  const { data: fillUps, isLoading } = useGetFillUps();
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  const filteredFillUps = fillUps ? filterFillUps(fillUps, dateRange, sortOrder) : [];

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Your Mileage</h2>
        <FillUpForm />
      </div>

      <MileageStats />

      {/* Filters and List Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Fill-Up History</h3>
        
        {!isLoading && fillUps && fillUps.length > 0 && (
          <FiltersBar
            dateRange={dateRange}
            sortOrder={sortOrder}
            onDateRangeChange={setDateRange}
            onSortOrderChange={setSortOrder}
          />
        )}

        <FillUpList filteredFillUps={filteredFillUps} />
      </div>
    </div>
  );
}
