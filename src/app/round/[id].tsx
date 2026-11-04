import { router, useLocalSearchParams } from 'expo-router';
import { Alert, ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { ErrorView } from '@/components/error-view';
import { StatCard } from '@/components/stat-card';
import { TotalCard } from '@/components/total-card';
import { Spacing } from '@/constants/theme';
import { useDeleteRound } from '@/hooks/use-delete-round';
import { useRound } from '@/hooks/use-round';
import { useTheme } from '@/hooks/use-theme';
import { formatPlayedAt } from '@/lib/history';
import { statRows } from '@/lib/stat-rows';

// History and Map open this screen. All bars fill together: delay 0, no one-by-one reveal.
export default function RoundDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const roundId = Number(id);
  const query = useRound(roundId);
  const remove = useDeleteRound();

  function handleDelete() {
    remove.mutate(roundId, { onSuccess: () => router.back() });
  }

  function confirmDelete() {
    Alert.alert('Delete round', 'This round will be removed from your history.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: handleDelete },
    ]);
  }

  // The round is gone from the database: show nothing instead of "Could not find" while going back.
  if (remove.isSuccess) return null;

  function renderRound() {
    if (query.isPending) return <ActivityIndicator color={theme.text} />;
    if (query.isError) return <ErrorView message={query.error.message} onRetry={() => query.refetch()} />;
    if (query.data === null) return <Text style={{ color: theme.text }}>Could not find this round</Text>;

    const round = query.data;
    return (
      <>
        <View>
          <Text style={[styles.make, { color: theme.text }]}>{round.make}</Text>
          <Text style={{ color: theme.text }}>{round.model}</Text>
          <Text style={{ color: theme.textSecondary }}>{round.plate}</Text>
          <Text style={{ color: theme.textSecondary }}>{formatPlayedAt(round.playedAt)}</Text>
        </View>

        {statRows(round).map((row) => (
          <StatCard key={row.key} row={row} delay={0} />
        ))}

        <TotalCard total={round.total} delay={0} />

        <Button
          label={remove.isPending ? 'Deleting…' : 'Delete round'}
          onPress={confirmDelete}
          disabled={remove.isPending}
        />
        {remove.isError && (
          <ErrorView message={`Could not delete the round: ${remove.error.message}`} onRetry={handleDelete} />
        )}
      </>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic">
      {renderRound()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.three, gap: Spacing.three },
  make: { fontSize: 22, fontWeight: 'bold' },
});
