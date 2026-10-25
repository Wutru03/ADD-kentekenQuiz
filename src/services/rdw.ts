const BASE_URL = 'https://opendata.rdw.nl/resource';

// RDW returns every field as a string, and leaves fields out when unknown.
type VehicleRow = {
  merk?: string;
  handelsbenaming?: string;
  eerste_kleur?: string;
  voertuigsoort?: string;
  datum_eerste_toelating?: string; // "20010629"
  massa_ledig_voertuig?: string;
  cilinderinhoud?: string;
  aantal_cilinders?: string;
};

type FuelRow = {
  brandstof_omschrijving?: string;
  nettomaximumvermogen?: string;
  nominaal_continu_maximumvermogen?: string;
};

export type Fuel = {
  name: string;
  netPowerKw: number | null;
  continuousPowerKw: number | null;
};

export type Vehicle = {
  plate: string;
  make: string;
  model: string;
  colour: string;
  vehicleType: string;
  firstAdmissionYear: number | null;
  emptyWeightKg: number | null;
  cylinderCapacityCc: number | null;
  cylinders: number | null;
  fuels: Fuel[];
};

function toNumber(value: string | undefined): number | null {
  if (!value) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

async function fetchRows<T>(dataset: string, plate: string): Promise<T[]> {
  const response = await fetch(`${BASE_URL}/${dataset}.json?kenteken=${plate}`);
  if (!response.ok) throw new Error(`RDW request failed (${response.status})`);
  return response.json();
}

// Returns null for a plate RDW does not know (it answers with []).
export async function fetchVehicle(plate: string): Promise<Vehicle | null> {
  const [vehicles, fuels] = await Promise.all([
    fetchRows<VehicleRow>('m9d7-ebf2', plate),
    fetchRows<FuelRow>('8ys7-d773', plate),
  ]);
  const row = vehicles[0];
  if (!row) return null;

  return {
    plate,
    make: row.merk ?? '',
    model: row.handelsbenaming ?? '',
    colour: row.eerste_kleur ?? '',
    vehicleType: row.voertuigsoort ?? '',
    firstAdmissionYear: toNumber(row.datum_eerste_toelating?.slice(0, 4)),
    emptyWeightKg: toNumber(row.massa_ledig_voertuig),
    cylinderCapacityCc: toNumber(row.cilinderinhoud),
    cylinders: toNumber(row.aantal_cilinders),
    fuels: fuels.map((fuel) => ({
      name: fuel.brandstof_omschrijving ?? '',
      netPowerKw: toNumber(fuel.nettomaximumvermogen),
      continuousPowerKw: toNumber(fuel.nominaal_continu_maximumvermogen),
    })),
  };
}
