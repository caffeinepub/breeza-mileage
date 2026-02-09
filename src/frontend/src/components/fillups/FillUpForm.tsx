import { useState, useMemo } from 'react';
import { useAddFillUp, useGetFillUps } from '../../features/fillups/useFillUps';
import { validateFillUp } from '../../features/fillups/validation';
import { useGetCallerUserProfile } from '../../features/profile/useUserProfile';
import { getUnitLabels } from '../../features/units/units';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useActor } from '../../hooks/useActor';
import { parseActorError } from '../../utils/actorError';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function FillUpForm() {
  const [open, setOpen] = useState(false);
  const [odometer, setOdometer] = useState('');
  const [fuelAdded, setFuelAdded] = useState('');
  const [errors, setErrors] = useState<{ odometer?: string; fuelAdded?: string }>({});

  const { identity, loginStatus } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const { data: fillUps } = useGetFillUps();
  const { data: userProfile } = useGetCallerUserProfile();
  const addFillUp = useAddFillUp();

  const unitSystem = (userProfile?.unitSystem as 'metric' | 'imperial') || 'metric';
  const labels = getUnitLabels(unitSystem);

  const lastOdometer = fillUps && fillUps.length > 0 ? fillUps[fillUps.length - 1].odometer : undefined;

  // Compute actor readiness
  const isActorReady = useMemo(() => {
    const isTransitioning = loginStatus === 'initializing' || loginStatus === 'logging-in';
    return !isTransitioning && !actorFetching && !!actor;
  }, [loginStatus, actorFetching, actor]);

  // Determine if submission is available
  const isAuthenticated = !!identity;
  const isInitializing = loginStatus === 'initializing' || loginStatus === 'logging-in';
  const canSubmit = isAuthenticated && isActorReady && !addFillUp.isPending;

  // Generate user-facing message when submission is disabled
  const getDisabledMessage = (): string | null => {
    if (!isAuthenticated) {
      return 'Please sign in to record fill-ups';
    }
    if (isInitializing) {
      return 'Initializing connection...';
    }
    if (!isActorReady) {
      return 'Waiting for connection to be ready...';
    }
    return null;
  };

  const disabledMessage = getDisabledMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateFillUp(odometer, fuelAdded, lastOdometer);
    setErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    // Double-check readiness before submission
    if (!canSubmit) {
      toast.error('Cannot submit at this time. Please wait and try again.');
      return;
    }

    try {
      const odometerValue = parseFloat(odometer);
      const fuelValue = parseFloat(fuelAdded);

      // Convert imperial to metric for storage if needed
      const odometerKm = unitSystem === 'imperial' ? odometerValue / 0.621371 : odometerValue;
      const fuelL = unitSystem === 'imperial' ? fuelValue / 0.264172 : fuelValue;

      await addFillUp.mutateAsync({
        odometer: odometerKm,
        fuelAdded: fuelL,
      });

      toast.success('Fill-up recorded successfully!');
      setOdometer('');
      setFuelAdded('');
      setErrors({});
      setOpen(false);
    } catch (error) {
      const parsed = parseActorError(error, 'Fill-up recording');
      toast.error(parsed.userMessage);
      console.error('Add fill-up error:', parsed.consoleDetails);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Fill-Up
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record Fill-Up</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {disabledMessage && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted text-muted-foreground text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{disabledMessage}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="odometer">
              Odometer Reading ({labels.distance})
            </Label>
            <Input
              id="odometer"
              type="number"
              step="0.1"
              placeholder={`e.g., ${unitSystem === 'metric' ? '50000' : '31000'}`}
              value={odometer}
              onChange={(e) => setOdometer(e.target.value)}
              className={errors.odometer ? 'border-destructive' : ''}
              disabled={!canSubmit}
            />
            {errors.odometer && (
              <p className="text-sm text-destructive">{errors.odometer}</p>
            )}
            {lastOdometer && !errors.odometer && (
              <p className="text-xs text-muted-foreground">
                Last reading: {unitSystem === 'imperial' 
                  ? (lastOdometer * 0.621371).toFixed(1) 
                  : lastOdometer.toFixed(1)} {labels.distance}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fuelAdded">
              Fuel Added ({labels.fuel})
            </Label>
            <Input
              id="fuelAdded"
              type="number"
              step="0.01"
              placeholder={`e.g., ${unitSystem === 'metric' ? '45.5' : '12.0'}`}
              value={fuelAdded}
              onChange={(e) => setFuelAdded(e.target.value)}
              className={errors.fuelAdded ? 'border-destructive' : ''}
              disabled={!canSubmit}
            />
            {errors.fuelAdded && (
              <p className="text-sm text-destructive">{errors.fuelAdded}</p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setOpen(false);
                setOdometer('');
                setFuelAdded('');
                setErrors({});
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={!canSubmit}
            >
              {addFillUp.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
