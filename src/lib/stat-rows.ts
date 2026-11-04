import { NUMBER_FIELDS } from '@/lib/stats';
import type { StoredRound } from '@/services/rounds';

export type StatRow = { key: string; label: string; guess: string; real: string; score: number | null };

export function formatValue(value: number | string | null, unit: string): string {
  if (value === null) return '-';
  return unit === '' ? String(value) : `${value} ${unit}`;
}

// One row per stat that was asked (it has a real value), in the order of the guess form.
export function statRows(round: StoredRound): StatRow[] {
  const rows: StatRow[] = NUMBER_FIELDS.filter((field) => round.real[field.stat] !== null).map((field) => ({
    key: field.stat,
    label: field.label,
    guess: formatValue(round.guesses[field.stat], field.unit),
    real: formatValue(round.real[field.stat], field.unit),
    score: round.scores[field.stat],
  }));
  if (round.real.fuel !== null) {
    rows.push({
      key: 'fuel',
      label: 'Fuel',
      guess: formatValue(round.guesses.fuel, ''),
      real: formatValue(round.real.fuel, ''),
      score: round.scores.fuel,
    });
  }
  return rows;
}
