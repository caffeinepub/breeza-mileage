export interface ValidationResult {
  isValid: boolean;
  errors: {
    odometer?: string;
    fuelAdded?: string;
  };
}

export function validateFillUp(
  odometerStr: string,
  fuelAddedStr: string,
  lastOdometer?: number
): ValidationResult {
  const errors: ValidationResult['errors'] = {};

  // Validate odometer
  if (!odometerStr.trim()) {
    errors.odometer = 'Odometer reading is required';
  } else {
    const odometer = parseFloat(odometerStr);
    if (isNaN(odometer)) {
      errors.odometer = 'Please enter a valid number';
    } else if (odometer <= 0) {
      errors.odometer = 'Odometer must be greater than zero';
    } else if (lastOdometer !== undefined && odometer <= lastOdometer) {
      errors.odometer = `Odometer must be greater than last reading (${lastOdometer})`;
    }
  }

  // Validate fuel added
  if (!fuelAddedStr.trim()) {
    errors.fuelAdded = 'Fuel amount is required';
  } else {
    const fuelAdded = parseFloat(fuelAddedStr);
    if (isNaN(fuelAdded)) {
      errors.fuelAdded = 'Please enter a valid number';
    } else if (fuelAdded <= 0) {
      errors.fuelAdded = 'Fuel amount must be greater than zero';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
