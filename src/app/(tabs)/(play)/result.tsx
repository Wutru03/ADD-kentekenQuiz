import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, ScrollView, type ScrollViewInstance, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { ErrorView } from '@/components/error-view';
import { ScoreBar } from '@/components/score-bar';
import { Radius, Spacing } from '@/constants/theme';
import { useRound } from '@/hooks/use-round';
import { useTheme } from '@/hooks/use-theme';
import { NUMBER_FIELDS } from '@/lib/stats';
import type { StoredRound } from '@/services/rounds';

// Bars fill one after the other: each starts when the previous one is done, the total goes last.
const BAR_STEP_MS = 700;

function formatValue(value: number | string | null, unit: string): string {
  if (value === null) return '-';
  return unit === '' ? String(value) : `${value} ${unit}`;
}

type StatRow = { key: string; label: string; guess: string; real: string; score: number | null };

// One row per stat that was asked (it has a real value), in the order of the guess form.
function statRows(round: StoredRound): StatRow[] {
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

export default function ResultScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useRound(Number(id));

  // Follow the reveal: when a bar starts filling, scroll just far enough to keep its card in frame.
  const scrollRef = useRef<ScrollViewInstance>(null);
  const viewportHeight = useRef(0);
  const scrollOffset = useRef(0);
  const cards = useRef<{ y: number; height: number }[]>([]); // per row, the total card last
  const rowCount = query.data ? statRows(query.data).length : 0;

  useEffect(() => {
    if (rowCount === 0) return;
    const timers = Array.from({ length: rowCount + 1 }, (_, index) =>
      setTimeout(() => {
        const card = cards.current[index];
        if (!card) return;
        if (index === rowCount) {
          scrollRef.current?.scrollToEnd({ animated: true }); // total: also shows "Play again"
          return;
        }
        const bottom = card.y + card.height + Spacing.three;
        if (bottom > scrollOffset.current + viewportHeight.current) {
          scrollRef.current?.scrollTo({ y: bottom - viewportHeight.current, animated: true });
        }
      }, index * BAR_STEP_MS),
    );
    return () => timers.forEach(clearTimeout);
  }, [rowCount]);

  // A new roundKey makes the Play screen start empty.
  function handlePlayAgain() {
    router.dismissTo({ pathname: '/', params: { roundKey: String(Date.now()) } });
  }

  function renderRound() {
    if (query.isPending) return <ActivityIndicator color={theme.text} />;
    if (query.isError) return <ErrorView message={query.error.message} onRetry={() => query.refetch()} />;
    if (query.data === null) return <Text style={{ color: theme.text }}>Could not find this round</Text>;

    const round = query.data;
    const rows = statRows(round);
    return (
      <>
        <View>
          <Text style={[styles.make, { color: theme.text }]}>{round.make}</Text>
          <Text style={{ color: theme.text }}>{round.model}</Text>
          <Text style={{ color: theme.textSecondary }}>{round.plate}</Text>
        </View>

        {rows.map((row, index) => (
          <View
            key={row.key}
            onLayout={(event) => {
              cards.current[index] = event.nativeEvent.layout;
            }}
            accessible
            accessibilityLabel={`${row.label}: your guess ${row.guess}, real value ${row.real}, score ${row.score} out of 100`}
            style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.label, { color: theme.text }]}>{row.label}</Text>
            <Text style={{ color: theme.text }}>Your guess: {row.guess}</Text>
            <Text style={{ color: theme.text }}>Real value: {row.real}</Text>
            <Text style={[styles.label, { color: theme.text }]}>Score: {row.score} / 100</Text>
            <ScoreBar score={row.score ?? 0} delay={index * BAR_STEP_MS} />
          </View>
        ))}

        <View
          onLayout={(event) => {
            cards.current[rows.length] = event.nativeEvent.layout;
          }}
          accessible
          accessibilityLabel={`Total score ${round.total} out of 100`}
          style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={{ color: theme.textSecondary }}>Total score</Text>
          <Text style={[styles.total, { color: theme.text }]}>{round.total} / 100</Text>
          <ScoreBar score={round.total} delay={rows.length * BAR_STEP_MS} />
        </View>

        <Text style={{ color: theme.textSecondary }}>Round #{round.id} saved</Text>
      </>
    );
  }

  return (
    <ScrollView
      ref={scrollRef}
      onLayout={(event) => {
        viewportHeight.current = event.nativeEvent.layout.height;
      }}
      onScroll={(event) => {
        scrollOffset.current = event.nativeEvent.contentOffset.y;
      }}
      scrollEventThrottle={16}
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic">
      {renderRound()}
      <Button label="Play again" onPress={handlePlayAgain} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.three, gap: Spacing.three },
  make: { fontSize: 22, fontWeight: 'bold' },
  card: { padding: Spacing.three, borderRadius: Radius.m, gap: Spacing.one },
  label: { fontWeight: 'bold' },
  total: { fontSize: 32, fontWeight: 'bold' },
});
