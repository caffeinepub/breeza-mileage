import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import type { FillUp } from '../../backend';
import type { FillUpEntry } from './types';

/**
 * Safely convert nanosecond timestamp (bigint) to milliseconds (number)
 * Returns NaN if conversion would overflow or lose precision
 */
function nanosToMillis(nanos: bigint): number {
  try {
    // Divide as BigInt first to avoid overflow
    const millis = nanos / 1_000_000n;
    
    // Check if result fits safely in JavaScript number
    if (millis > BigInt(Number.MAX_SAFE_INTEGER)) {
      console.warn('Timestamp too large for safe conversion:', nanos);
      return NaN;
    }
    
    return Number(millis);
  } catch (error) {
    console.error('Error converting timestamp:', error);
    return NaN;
  }
}

export function useGetFillUps() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<FillUpEntry[]>({
    queryKey: ['fillUps'],
    queryFn: async () => {
      if (!actor) return [];
      const fillUps = await actor.getFillUps();
      
      // Sort by timestamp chronologically (oldest first) for consistent calculations
      const sortedFillUps = [...fillUps].sort((a, b) => {
        const timeA = nanosToMillis(a.timestamp);
        const timeB = nanosToMillis(b.timestamp);
        // Handle NaN timestamps by placing them at the end
        if (isNaN(timeA) && isNaN(timeB)) return 0;
        if (isNaN(timeA)) return 1;
        if (isNaN(timeB)) return -1;
        return timeA - timeB;
      });
      
      // Convert backend FillUp to FillUpEntry and compute derived fields
      return sortedFillUps.map((fillUp: FillUp, index: number) => {
        const entry: FillUpEntry = {
          odometer: Number(fillUp.odometer),
          fuelAdded: fillUp.fuelAdded,
          totalFuelCost: fillUp.totalFuelCost > 0 ? fillUp.totalFuelCost : undefined,
          timestamp: nanosToMillis(fillUp.timestamp),
        };

        // Compute price per liter if cost is available
        if (entry.totalFuelCost !== undefined && entry.fuelAdded > 0) {
          entry.pricePerLiter = entry.totalFuelCost / entry.fuelAdded;
        }

        // Compute distance and efficiency if there's a previous entry
        if (index > 0) {
          const prevOdometer = Number(sortedFillUps[index - 1].odometer);
          entry.distanceSinceLast = entry.odometer - prevOdometer;
          if (entry.distanceSinceLast > 0 && entry.fuelAdded > 0) {
            entry.efficiency = entry.distanceSinceLast / entry.fuelAdded;
          }
        }

        return entry;
      });
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddFillUp() {
  const { actor, isFetching: actorFetching } = useActor();
  const { loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ odometer, fuelAdded, totalFuelCost }: { odometer: number; fuelAdded: number; totalFuelCost: number }) => {
      // Prevent execution if actor is not ready
      const isTransitioning = loginStatus === 'initializing' || loginStatus === 'logging-in';
      if (!actor || actorFetching || isTransitioning) {
        throw new Error('Actor not available - please wait for initialization to complete');
      }
      await actor.addFillUp(BigInt(Math.round(odometer)), fuelAdded, totalFuelCost);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fillUps'] });
    },
  });
}
