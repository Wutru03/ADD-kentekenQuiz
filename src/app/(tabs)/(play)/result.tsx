import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, ScrollView, type ScrollViewInstance, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { ErrorView } from '@/components/error-view';
import { StatCard } from '@/components/stat-card';
import { TotalCard } from '@/components/total-card';
import { Spacing } from '@/constants/theme';
import { useRound } from '@/hooks/use-round';
import { useTheme } from '@/hooks/use-theme';
import { statRows } from '@/lib/stat-rows';

// Bars fill one after the other: each starts when the previous one is done, the total goes last.
const BAR_STEP_MS = 700;

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
          <StatCard
            key={row.key}
            row={row}
            delay={index * BAR_STEP_MS}
            onLayout={(event) => {
              cards.current[index] = event.nativeEvent.layout;
            }}
          />
        ))}

        <TotalCard
          total={round.total}
          delay={rows.length * BAR_STEP_MS}
          onLayout={(event) => {
            cards.current[rows.length] = event.nativeEvent.layout;
          }}
        />

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
});
