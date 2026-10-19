import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = { title: string; note: string };

// Temporary screen body until the feature issue for this tab is built.
export function PlaceholderScreen({ title, note }: Props) {
  const theme = useTheme();

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={{ color: theme.textSecondary }}>{note}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.three },
  title: { fontSize: 28, fontWeight: 'bold', paddingVertical: Spacing.two },
});
