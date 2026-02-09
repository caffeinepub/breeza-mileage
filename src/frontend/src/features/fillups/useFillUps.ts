import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import type { FillUp } from '../../backend';
import type { FillUpEntry } from './types';

export function useGetFillUps() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<FillUpEntry[]>({
    queryKey: ['fillUps'],
    queryFn: async () => {
      if (!actor) return [];
      const fillUps = await actor.getFillUps();
      
      // Convert backend FillUp to FillUpEntry and compute derived fields
      return fillUps.map((fillUp: FillUp, index: number) => {
        const entry: FillUpEntry = {
          odometer: Number(fillUp.odometer),
          fuelAdded: fillUp.fuelAdded,
        };

        // Compute distance and efficiency if there's a previous entry
        if (index > 0) {
          const prevOdometer = Number(fillUps[index - 1].odometer);
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
    mutationFn: async ({ odometer, fuelAdded }: { odometer: number; fuelAdded: number }) => {
      // Prevent execution if actor is not ready
      const isTransitioning = loginStatus === 'initializing' || loginStatus === 'logging-in';
      if (!actor || actorFetching || isTransitioning) {
        throw new Error('Actor not available - please wait for initialization to complete');
      }
      await actor.addFillUp(BigInt(Math.round(odometer)), fuelAdded);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fillUps'] });
    },
  });
}
