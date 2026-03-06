import type { UnitSystem } from '../fillups/types';

export interface UnitLabels {
  distance: string;
  fuel: string;
  efficiency: string;
  efficiencyAlt?: string;
}

export function getUnitLabels(unitSystem: UnitSystem): UnitLabels {
  if (unitSystem === 'metric') {
    return {
      distance: 'km',
      fuel: 'L',
      efficiency: 'km/L',
      efficiencyAlt: 'L/100km',
    };
  } else {
    return {
      distance: 'mi',
      fuel: 'gal',
      efficiency: 'MPG',
    };
  }
}

export function formatEfficiency(
  efficiency: number | undefined,
  unitSystem: UnitSystem
): string {
  if (efficiency === undefined) return 'N/A';

  if (unitSystem === 'metric') {
    // Show both km/L and L/100km
    const kmPerL = efficiency.toFixed(2);
    const lPer100km = (100 / efficiency).toFixed(2);
    return `${kmPerL} km/L (${lPer100km} L/100km)`;
  } else {
    // Convert km/L to MPG (US)
    const mpg = (efficiency * 2.352).toFixed(2);
    return `${mpg} MPG`;
  }
}

export function formatDistance(distance: number | undefined, unitSystem: UnitSystem): string {
  if (distance === undefined) return 'N/A';
  
  const labels = getUnitLabels(unitSystem);
  if (unitSystem === 'imperial') {
    // Convert km to miles
    const miles = distance * 0.621371;
    return `${miles.toFixed(1)} ${labels.distance}`;
  }
  return `${distance.toFixed(1)} ${labels.distance}`;
}

export function formatFuel(fuel: number, unitSystem: UnitSystem): string {
  const labels = getUnitLabels(unitSystem);
  if (unitSystem === 'imperial') {
    // Convert liters to gallons
    const gallons = fuel * 0.264172;
    return `${gallons.toFixed(2)} ${labels.fuel}`;
  }
  return `${fuel.toFixed(2)} ${labels.fuel}`;
}
