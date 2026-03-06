import { useGetFillUps } from '../../features/fillups/useFillUps';
import { useGetCallerUserProfile } from '../../features/profile/useUserProfile';
import { formatEfficiency, formatDistance } from '../../features/units/units';
import type { UnitSystem } from '../../features/fillups/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Award, MapPin } from 'lucide-react';

export default function MileageStats() {
  const { data: fillUps, isLoading } = useGetFillUps();
  const { data: userProfile } = useGetCallerUserProfile();

  const unitSystem = (userProfile?.unitSystem as UnitSystem) || 'metric';

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-surface-elevated">
            <CardHeader className="pb-3">
              <div className="h-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!fillUps || fillUps.length === 0) {
    return null;
  }

  // Calculate stats
  const entriesWithEfficiency = fillUps.filter(e => e.efficiency !== undefined);
  const avgEfficiency = entriesWithEfficiency.length > 0
    ? entriesWithEfficiency.reduce((sum, e) => sum + (e.efficiency || 0), 0) / entriesWithEfficiency.length
    : undefined;

  const bestEfficiency = entriesWithEfficiency.length > 0
    ? Math.max(...entriesWithEfficiency.map(e => e.efficiency || 0))
    : undefined;

  const worstEfficiency = entriesWithEfficiency.length > 0
    ? Math.min(...entriesWithEfficiency.map(e => e.efficiency || 0))
    : undefined;

  const totalDistance = fillUps.length > 1
    ? fillUps[fillUps.length - 1].odometer - fillUps[0].odometer
    : undefined;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-surface-elevated border-l-4 border-l-chart-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <div className="bg-block-accent-1 p-1.5 rounded">
              <TrendingUp className="h-3.5 w-3.5 text-chart-1" />
            </div>
            Average
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {entriesWithEfficiency.length > 0 ? (
              <span className="text-lg">{formatEfficiency(avgEfficiency, unitSystem)}</span>
            ) : (
              <span className="text-muted-foreground text-base">N/A</span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-surface-elevated border-l-4 border-l-chart-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <div className="bg-block-accent-2 p-1.5 rounded">
              <Award className="h-3.5 w-3.5 text-chart-2" />
            </div>
            Best Tank
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {bestEfficiency !== undefined ? (
              <span className="text-lg">{formatEfficiency(bestEfficiency, unitSystem)}</span>
            ) : (
              <span className="text-muted-foreground text-base">N/A</span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-surface-elevated border-l-4 border-l-chart-3">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <div className="bg-block-accent-3 p-1.5 rounded">
              <TrendingDown className="h-3.5 w-3.5 text-chart-3" />
            </div>
            Worst Tank
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {worstEfficiency !== undefined ? (
              <span className="text-lg">{formatEfficiency(worstEfficiency, unitSystem)}</span>
            ) : (
              <span className="text-muted-foreground text-base">N/A</span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-surface-elevated border-l-4 border-l-chart-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <div className="bg-block-accent-4 p-1.5 rounded">
              <MapPin className="h-3.5 w-3.5 text-chart-4" />
            </div>
            Total Distance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {totalDistance !== undefined ? (
              formatDistance(totalDistance, unitSystem)
            ) : (
              <span className="text-muted-foreground text-base">N/A</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
