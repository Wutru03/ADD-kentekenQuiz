import type { Vehicle } from '@/services/rdw';

export type NumberStat = 'year' | 'weight' | 'power' | 'litres' | 'cylinders';

export const FUEL_ANSWERS = ['Petrol', 'Diesel', 'Electric', 'LPG', 'Hybrid'] as const;
export type FuelAnswer = (typeof FUEL_ANSWERS)[number];

// The real value per stat; null = missing, so the stat is not asked.
export type RealValues = Record<NumberStat, number | null> & { fuel: FuelAnswer | null };

export type Range = { min: number; max: number; step: number };

const COMBUSTION_FUELS = ['Benzine', 'Diesel', 'LPG'];

// RDW fuel rows -> one answer. Anything not in the spec (Waterstof, CNG, ...) is not asked.
export function fuelAnswer(names: string[]): FuelAnswer | null {
  const fuels = new Set(names);
  if (fuels.has('LPG')) return 'LPG';
  if (fuels.has('Elektriciteit')) {
    if (fuels.size === 1) return 'Electric';
    if (fuels.size === 2 && (fuels.has('Benzine') || fuels.has('Diesel'))) return 'Hybrid';
    return null;
  }
  if (fuels.size === 1 && fuels.has('Benzine')) return 'Petrol';
  if (fuels.size === 1 && fuels.has('Diesel')) return 'Diesel';
  return null;
}

export function realValues(vehicle: Vehicle): RealValues {
  const fuel = fuelAnswer(vehicle.fuels.map((row) => row.name));
  const powerKw =
    fuel === 'Electric'
      ? (vehicle.fuels[0]?.continuousPowerKw ?? null)
      : (vehicle.fuels.find((row) => COMBUSTION_FUELS.includes(row.name))?.netPowerKw ?? null);
  const cc = vehicle.cylinderCapacityCc;

  return {
    year: vehicle.firstAdmissionYear,
    weight: vehicle.emptyWeightKg,
    power: powerKw === null ? null : Math.round(powerKw * 1.36),
    litres: cc === null ? null : Math.round(cc / 100) / 10,
    cylinders: vehicle.cylinders,
    fuel,
  };
}

// No upper limit (Infinity) for weight, power and cylinders, so trucks and hypercars fit.
export const NUMBER_RANGES: Record<NumberStat, Range> = {
  year: { min: 1900, max: new Date().getFullYear(), step: 1 },
  weight: { min: 0, max: Infinity, step: 1 },
  power: { min: 0, max: Infinity, step: 1 },
  litres: { min: 0, max: 8, step: 0.1 },
  cylinders: { min: 0, max: Infinity, step: 1 },
};

// Clamp to min/max and snap to the step. toFixed(1) drops float noise like 2.3000000000000003.
export function clampToRange(value: number, { min, max, step }: Range): number {
  const clamped = Math.min(max, Math.max(min, value));
  return Number((Math.round(clamped / step) * step).toFixed(1));
}

// "2,3" and "2.3" both work, because a Dutch phone keyboard types a comma.
export function parseNumber(text: string): number | null {
  if (text.trim() === '') return null;
  const number = Number(text.replace(',', '.'));
  return Number.isFinite(number) ? number : null;
}
