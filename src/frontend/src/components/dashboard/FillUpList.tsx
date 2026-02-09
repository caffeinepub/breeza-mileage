import { useGetCallerUserProfile } from '../../features/profile/useUserProfile';
import { formatEfficiency, formatDistance, formatFuel } from '../../features/units/units';
import type { UnitSystem, FillUpEntry } from '../../features/fillups/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Fuel, TrendingUp } from 'lucide-react';

interface FillUpListProps {
  entries: FillUpEntry[];
}

export default function FillUpList({ entries }: FillUpListProps) {
  const { data: userProfile } = useGetCallerUserProfile();
  const unitSystem = (userProfile?.unitSystem as UnitSystem) || 'metric';

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Fuel className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Fill-Ups Yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Start tracking your fuel efficiency by recording your first fill-up. 
            Click "Add Fill-Up" above to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry, index) => (
        <Card key={index}>
          <CardContent className="p-3">
            <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap">
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline" className="text-xs">
                  #{entries.length - index}
                </Badge>
                {index === 0 && entries.length > 1 && (
                  <Badge variant="secondary" className="text-xs">Latest</Badge>
                )}
              </div>
              
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-xs text-muted-foreground">Odometer:</span>
                <span className="text-sm font-semibold text-foreground">
                  {formatDistance(entry.odometer, unitSystem)}
                </span>
              </div>

              <div className="w-px h-4 bg-border shrink-0" />

              <div className="flex items-center gap-1 shrink-0">
                <span className="text-xs text-muted-foreground">Fuel:</span>
                <span className="text-sm font-semibold text-foreground">
                  {formatFuel(entry.fuelAdded, unitSystem)}
                </span>
              </div>

              {entry.distanceSinceLast !== undefined && (
                <>
                  <div className="w-px h-4 bg-border shrink-0" />
                  
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs text-muted-foreground">Distance:</span>
                    <span className="text-sm font-semibold text-foreground">
                      {formatDistance(entry.distanceSinceLast, unitSystem)}
                    </span>
                  </div>

                  <div className="w-px h-4 bg-border shrink-0" />

                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs text-muted-foreground">Efficiency:</span>
                    <span className="text-sm font-semibold text-primary flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {formatEfficiency(entry.efficiency, unitSystem)}
                    </span>
                  </div>
                </>
              )}

              {entry.distanceSinceLast === undefined && index === entries.length - 1 && (
                <>
                  <div className="w-px h-4 bg-border shrink-0" />
                  <span className="text-xs text-muted-foreground italic shrink-0">
                    First entry - mileage calculated with next fill-up
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
