import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = { message: string; onRetry: () => void };

export function ErrorView({ message, onRetry }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={{ color: theme.text }}>{message}</Text>
      <Button label="Try again" onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.three },
});
