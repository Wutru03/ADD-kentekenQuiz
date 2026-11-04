import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { carName } from '@/lib/history';
import type { StoredRound } from '@/services/rounds';

// The card over the map for the tapped pin; pressing it opens the round detail.
export function PinCard({ round }: { round: StoredRound }) {
  const theme = useTheme();
  const name = carName(round.make, round.model);

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/round/[id]', params: { id: String(round.id) } })}
      accessibilityRole="button"
      accessibilityLabel={`${name}, plate ${round.plate}, total score ${round.total} out of 100. Open round`}
      style={[styles.card, { backgroundColor: theme.card }]}>
      <View style={styles.text}>
        <Text style={[styles.bold, { color: theme.text }]}>{name}</Text>
        <Text style={{ color: theme.textSecondary }}>{round.plate}</Text>
      </View>
      <Text style={[styles.bold, { color: theme.text }]}>{round.total} / 100</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.m,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  text: { flex: 1 },
  bold: { fontWeight: 'bold' },
});
