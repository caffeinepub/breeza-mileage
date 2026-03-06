export type UnitSystem = 'metric' | 'imperial';

export interface FillUpEntry {
  odometer: number;
  fuelAdded: number;
  totalFuelCost?: number; // Optional for backward compatibility
  timestamp: number; // Epoch milliseconds
  // Computed fields
  distanceSinceLast?: number;
  efficiency?: number;
  pricePerLiter?: number; // Computed from totalFuelCost / fuelAdded
}

export interface FillUpFormData {
  odometer: string;
  fuelAdded: string;
  totalFuelCost: string;
}
