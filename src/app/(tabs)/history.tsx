import { router } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { ErrorView } from '@/components/error-view';
import { Radius, Spacing } from '@/constants/theme';
import { useRounds } from '@/hooks/use-rounds';
import { useTheme } from '@/hooks/use-theme';
import { carName, formatPlayedAt, highScore } from '@/lib/history';
import type { StoredRound } from '@/services/rounds';

export default function HistoryScreen() {
  const theme = useTheme();
  const query = useRounds();

  function renderRound(round: StoredRound) {
    const date = formatPlayedAt(round.playedAt);
    const name = carName(round.make, round.model);
    return (
      <View style={[styles.item, { backgroundColor: theme.card }]}>
        <Pressable
          onPress={() => router.push({ pathname: '/round/[id]', params: { id: String(round.id) } })}
          accessibilityRole="button"
          accessibilityLabel={`${name}, plate ${round.plate}, total score ${round.total} out of 100, ${date}`}
          style={styles.row}>
          <View style={styles.cardText}>
            <Text style={[styles.bold, { color: theme.text }]}>{name}</Text>
            <Text style={{ color: theme.textSecondary }}>{round.plate}</Text>
            <Text style={{ color: theme.textSecondary }}>{date}</Text>
          </View>
          <Text style={[styles.bold, { color: theme.text }]}>{round.total} / 100</Text>
        </Pressable>
        {round.coords !== null && (
          <Button
            label="View on map"
            onPress={() => router.navigate({ pathname: '/map', params: { roundId: String(round.id) } })}
          />
        )}
      </View>
    );
  }

  function renderBody() {
    if (query.isPending) return <ActivityIndicator color={theme.text} />;
    if (query.isError) return <ErrorView message={query.error.message} onRetry={() => query.refetch()} />;

    const rounds = query.data;
    const best = highScore(rounds);
    if (best === null) {
      return <Text style={{ color: theme.text }}>No rounds yet. Look up a plate to play.</Text>;
    }

    return (
      <FlatList
        data={rounds}
        keyExtractor={(round) => String(round.id)}
        renderItem={({ item }) => renderRound(item)}
        contentContainerStyle={styles.list}
        contentInsetAdjustmentBehavior="automatic"
        ListHeaderComponent={
          <View
            accessible
            accessibilityLabel={`High score ${best} out of 100`}
            style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={{ color: theme.textSecondary }}>High score</Text>
            <Text style={[styles.best, { color: theme.text }]}>{best} / 100</Text>
          </View>
        }
      />
    );
  }

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>History</Text>
      {renderBody()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.three, gap: Spacing.two },
  title: { fontSize: 28, fontWeight: 'bold', paddingVertical: Spacing.two },
  list: { gap: Spacing.two },
  item: { gap: Spacing.two, padding: Spacing.three, borderRadius: Radius.m },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.m,
  },
  cardText: { flex: 1 },
  bold: { fontWeight: 'bold' },
  best: { fontSize: 32, fontWeight: 'bold' },
});
