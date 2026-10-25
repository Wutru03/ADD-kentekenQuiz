import type { Fuel, Vehicle } from '@/services/rdw';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isNumberOrNull(value: unknown): boolean {
  return value === null || typeof value === 'number';
}

function isFuel(value: unknown): value is Fuel {
  return (
    isRecord(value) &&
    typeof value.name === 'string' &&
    isNumberOrNull(value.netPowerKw) &&
    isNumberOrNull(value.continuousPowerKw)
  );
}

export function isVehicle(value: unknown): value is Vehicle {
  return (
    isRecord(value) &&
    typeof value.plate === 'string' &&
    typeof value.make === 'string' &&
    typeof value.model === 'string' &&
    typeof value.colour === 'string' &&
    typeof value.vehicleType === 'string' &&
    isNumberOrNull(value.firstAdmissionYear) &&
    isNumberOrNull(value.emptyWeightKg) &&
    isNumberOrNull(value.cylinderCapacityCc) &&
    isNumberOrNull(value.cylinders) &&
    Array.isArray(value.fuels) &&
    value.fuels.every(isFuel)
  );
}

// The vehicle travels to the guess screen as a JSON route param; null if it is missing or broken.
export function parseVehicleParam(param: string | string[] | undefined): Vehicle | null {
  if (typeof param !== 'string') return null;
  try {
    const value: unknown = JSON.parse(param);
    return isVehicle(value) ? value : null;
  } catch {
    return null;
  }
}
