import type { FuelAnswer, NumberStat, RealValues } from '@/lib/stats';

export type Guesses = Record<NumberStat, number | null> & { fuel: FuelAnswer | null };

// One score per stat, 0-100; null = the stat was not asked.
export type Scores = Record<NumberStat | 'fuel', number | null>;

// How far off a guess can be before it scores 0.
export const SCORE_RANGES: Record<NumberStat, number> = {
  year: 8,
  weight: 400,
  power: 80,
  litres: 0.5,
  cylinders: 2,
};

const NUMBER_STATS: NumberStat[] = ['year', 'weight', 'power', 'litres', 'cylinders'];

function scoreNumber(stat: NumberStat, guess: number, real: number): number {
  const score = 100 * (1 - Math.abs(guess - real) / SCORE_RANGES[stat]);
  return Math.max(0, Math.round(score));
}

// Only stats with a real value and a guess are scored; the total is the rounded average of those.
export function scoreRound(real: RealValues, guesses: Guesses): { scores: Scores; total: number } {
  const scores: Scores = { year: null, weight: null, power: null, litres: null, cylinders: null, fuel: null };
  let sum = 0;
  let asked = 0;

  for (const stat of NUMBER_STATS) {
    const realValue = real[stat];
    const guess = guesses[stat];
    if (realValue === null || guess === null) continue;
    const score = scoreNumber(stat, guess, realValue);
    scores[stat] = score;
    sum += score;
    asked += 1;
  }
  if (real.fuel !== null && guesses.fuel !== null) {
    const score = guesses.fuel === real.fuel ? 100 : 0;
    scores.fuel = score;
    sum += score;
    asked += 1;
  }

  return { scores, total: asked === 0 ? 0 : Math.round(sum / asked) };
}
