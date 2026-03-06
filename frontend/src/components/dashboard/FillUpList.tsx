import { useGetFillUps } from '../../features/fillups/useFillUps';
import { useGetCallerUserProfile } from '../../features/profile/useUserProfile';
import { formatEfficiency, formatDistance, formatFuel } from '../../features/units/units';
import { formatDateTime } from '../../features/fillups/dateTime';
import type { UnitSystem } from '../../features/fillups/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Fuel, Gauge, MapPin, TrendingUp, DollarSign } from 'lucide-react';

interface FillUpListProps {
  filteredFillUps: Array<{
    odometer: number;
    fuelAdded: number;
    totalFuelCost?: number;
    timestamp: number;
    distanceSinceLast?: number;
    efficiency?: number;
    pricePerLiter?: number;
  }>;
}

export default function FillUpList({ filteredFillUps }: FillUpListProps) {
  const { isLoading } = useGetFillUps();
  const { data: userProfile } = useGetCallerUserProfile();

  const unitSystem = (userProfile?.unitSystem as UnitSystem) || 'metric';

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-surface-elevated">
            <CardContent className="p-3">
              <div className="h-12 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredFillUps.length === 0) {
    return (
      <Card className="bg-surface-inset border-border">
        <CardContent className="p-8 text-center">
          <Fuel className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No fill-ups recorded yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add your first fill-up to start tracking your mileage.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {filteredFillUps.map((fillUp, index) => (
        <Card key={index} className="bg-surface-elevated border-border hover:shadow-sm transition-shadow">
          <CardContent className="p-3">
            <div className="flex flex-wrap items-center gap-2.5 text-sm">
              {/* Odometer with Date */}
              <div className="flex items-center gap-1.5 min-w-[140px]">
                <div className="bg-block-accent-1 p-1 rounded">
                  <Gauge className="h-3 w-3 text-chart-1" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Odometer</div>
                  <div className="font-semibold text-foreground">
                    {formatDistance(fillUp.odometer, unitSystem)}
                  </div>
                  <div className="text-[10px] text-muted-foreground/80 leading-tight">
                    {formatDateTime(fillUp.timestamp)}
                  </div>
                </div>
              </div>

              {/* Fuel Added */}
              <div className="flex items-center gap-1.5 min-w-[110px]">
                <div className="bg-block-accent-2 p-1 rounded">
                  <Fuel className="h-3 w-3 text-chart-2" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Fuel</div>
                  <div className="font-semibold text-foreground">
                    {formatFuel(fillUp.fuelAdded, unitSystem)}
                  </div>
                </div>
              </div>

              {/* Price per Liter */}
              {fillUp.pricePerLiter !== undefined && (
                <div className="flex items-center gap-1.5 min-w-[110px]">
                  <div className="bg-block-accent-4 p-1 rounded">
                    <DollarSign className="h-3 w-3 text-chart-4" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Price/L</div>
                    <div className="font-semibold text-foreground">
                      {fillUp.pricePerLiter.toFixed(2)}
                    </div>
                  </div>
                </div>
              )}

              {/* Distance */}
              {fillUp.distanceSinceLast !== undefined && (
                <div className="flex items-center gap-1.5 min-w-[110px]">
                  <div className="bg-block-accent-3 p-1 rounded">
                    <MapPin className="h-3 w-3 text-chart-3" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Distance</div>
                    <div className="font-semibold text-foreground">
                      {formatDistance(fillUp.distanceSinceLast, unitSystem)}
                    </div>
                  </div>
                </div>
              )}

              {/* Efficiency Badge */}
              {fillUp.efficiency !== undefined && (
                <div className="flex items-center gap-1.5 ml-auto">
                  <TrendingUp className="h-3 w-3 text-primary" />
                  <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 text-xs py-0 h-5">
                    {formatEfficiency(fillUp.efficiency, unitSystem)}
                  </Badge>
                </div>
              )}

              {fillUp.efficiency === undefined && (
                <Badge variant="outline" className="ml-auto text-muted-foreground border-muted text-xs py-0 h-5">
                  First entry
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
