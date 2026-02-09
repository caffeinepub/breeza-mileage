export type UnitSystem = 'metric' | 'imperial';

export interface FillUpEntry {
  odometer: number;
  fuelAdded: number;
  // Computed fields
  distanceSinceLast?: number;
  efficiency?: number;
}

export interface FillUpFormData {
  odometer: string;
  fuelAdded: string;
}
