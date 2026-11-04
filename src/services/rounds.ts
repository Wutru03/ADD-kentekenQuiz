import type { SQLiteDatabase } from 'expo-sqlite';

import type { Guesses, Scores } from '@/lib/scoring';
import { type RealValues, toFuelAnswer } from '@/lib/stats';
import type { Coords } from '@/services/location';

export type Round = {
  plate: string;
  make: string;
  model: string;
  playedAt: string; // ISO date
  coords: Coords | null;
  real: RealValues;
  guesses: Guesses;
  scores: Scores;
  total: number;
};

export type StoredRound = Round & { id: number };

// A row of the rounds table (see database.ts); NULL columns come back as null.
type RoundRow = {
  id: number;
  plate: string;
  make: string;
  model: string;
  played_at: string;
  latitude: number | null;
  longitude: number | null;
  total_score: number;
  year_guess: number | null;
  year_real: number | null;
  year_score: number | null;
  weight_guess: number | null;
  weight_real: number | null;
  weight_score: number | null;
  power_guess: number | null;
  power_real: number | null;
  power_score: number | null;
  litres_guess: number | null;
  litres_real: number | null;
  litres_score: number | null;
  cylinders_guess: number | null;
  cylinders_real: number | null;
  cylinders_score: number | null;
  fuel_guess: string | null;
  fuel_real: string | null;
  fuel_score: number | null;
};

// Returns the id of the new row.
export async function insertRound(db: SQLiteDatabase, round: Round): Promise<number> {
  const { real, guesses, scores } = round;
  const result = await db.runAsync(
    `INSERT INTO rounds (
      plate, make, model, played_at, latitude, longitude, total_score,
      year_guess, year_real, year_score,
      weight_guess, weight_real, weight_score,
      power_guess, power_real, power_score,
      litres_guess, litres_real, litres_score,
      cylinders_guess, cylinders_real, cylinders_score,
      fuel_guess, fuel_real, fuel_score
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      round.plate,
      round.make,
      round.model,
      round.playedAt,
      round.coords?.latitude ?? null,
      round.coords?.longitude ?? null,
      round.total,
      guesses.year,
      real.year,
      scores.year,
      guesses.weight,
      real.weight,
      scores.weight,
      guesses.power,
      real.power,
      scores.power,
      guesses.litres,
      real.litres,
      scores.litres,
      guesses.cylinders,
      real.cylinders,
      scores.cylinders,
      guesses.fuel,
      real.fuel,
      scores.fuel,
    ],
  );
  return result.lastInsertRowId;
}

// Returns null when there is no round with this id.
export async function getRound(db: SQLiteDatabase, id: number): Promise<StoredRound | null> {
  const row = await db.getFirstAsync<RoundRow>('SELECT * FROM rounds WHERE id = ?', [id]);
  if (!row) return null;

  return {
    id: row.id,
    plate: row.plate,
    make: row.make,
    model: row.model,
    playedAt: row.played_at,
    coords:
      row.latitude !== null && row.longitude !== null
        ? { latitude: row.latitude, longitude: row.longitude }
        : null,
    real: {
      year: row.year_real,
      weight: row.weight_real,
      power: row.power_real,
      litres: row.litres_real,
      cylinders: row.cylinders_real,
      fuel: toFuelAnswer(row.fuel_real),
    },
    guesses: {
      year: row.year_guess,
      weight: row.weight_guess,
      power: row.power_guess,
      litres: row.litres_guess,
      cylinders: row.cylinders_guess,
      fuel: toFuelAnswer(row.fuel_guess),
    },
    scores: {
      year: row.year_score,
      weight: row.weight_score,
      power: row.power_score,
      litres: row.litres_score,
      cylinders: row.cylinders_score,
      fuel: row.fuel_score,
    },
    total: row.total_score,
  };
}
