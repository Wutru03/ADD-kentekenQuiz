import { type LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';

import { ScoreBar } from '@/components/score-bar';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { StatRow } from '@/lib/stat-rows';

type Props = { row: StatRow; delay: number; onLayout?: (event: LayoutChangeEvent) => void };

// One stat of a round: label, guess, real value, score and a bar. Shared by the result and the detail.
export function StatCard({ row, delay, onLayout }: Props) {
  const theme = useTheme();

  return (
    <View
      onLayout={onLayout}
      accessible
      accessibilityLabel={`${row.label}: your guess ${row.guess}, real value ${row.real}, score ${row.score} out of 100`}
      style={[styles.card, { backgroundColor: theme.card }]}>
      <Text style={[styles.label, { color: theme.text }]}>{row.label}</Text>
      <Text style={{ color: theme.text }}>Your guess: {row.guess}</Text>
      <Text style={{ color: theme.text }}>Real value: {row.real}</Text>
      <Text style={[styles.label, { color: theme.text }]}>Score: {row.score} / 100</Text>
      <ScoreBar score={row.score ?? 0} delay={delay} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: Spacing.three, borderRadius: Radius.m, gap: Spacing.one },
  label: { fontWeight: 'bold' },
});
