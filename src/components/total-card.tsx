import { type LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';

import { ScoreBar } from '@/components/score-bar';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = { total: number; delay: number; onLayout?: (event: LayoutChangeEvent) => void };

// The total score of a round with a bar. Shared by the result and the detail.
export function TotalCard({ total, delay, onLayout }: Props) {
  const theme = useTheme();

  return (
    <View
      onLayout={onLayout}
      accessible
      accessibilityLabel={`Total score ${total} out of 100`}
      style={[styles.card, { backgroundColor: theme.card }]}>
      <Text style={{ color: theme.textSecondary }}>Total score</Text>
      <Text style={[styles.total, { color: theme.text }]}>{total} / 100</Text>
      <ScoreBar score={total} delay={delay} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: Spacing.three, borderRadius: Radius.m, gap: Spacing.one },
  total: { fontSize: 32, fontWeight: 'bold' },
});
