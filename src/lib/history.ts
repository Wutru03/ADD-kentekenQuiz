// The highest total of all rounds; null when there are none.
export function highScore(rounds: { total: number }[]): number | null {
  return rounds.length === 0 ? null : Math.max(...rounds.map((round) => round.total));
}

// "4 Nov 2026, 14:05": English, day first, 24 hours, in the phone's time zone.
export function formatPlayedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
