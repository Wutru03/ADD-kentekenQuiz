import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorView } from '@/components/error-view';
import { Radius, Spacing } from '@/constants/theme';
import { usePlateLookup } from '@/hooks/use-plate-lookup';
import { useTheme } from '@/hooks/use-theme';
import { isValidPlate, normalisePlate } from '@/lib/plate';

export default function PlayScreen() {
  const theme = useTheme();
  const { plate, query, coords, lookUp } = usePlateLookup();
  const [input, setInput] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  function handleLookUp() {
    const normalised = normalisePlate(input);
    if (!isValidPlate(normalised)) {
      setInputError('A Dutch plate has 6 letters and digits');
      return;
    }
    setInputError(null);
    lookUp(normalised);
  }

  function renderResult() {
    if (plate === null) return null;
    if (query.isPending) return <ActivityIndicator color={theme.text} />;
    if (query.isError) return <ErrorView message={query.error.message} onRetry={() => query.refetch()} />;
    if (query.data === null) {
      return <Text style={{ color: theme.text }}>No vehicle found for this plate</Text>;
    }

    const vehicle = query.data;
    return (
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.make, { color: theme.text }]}>{vehicle.make}</Text>
        <Text style={{ color: theme.text }}>{vehicle.model}</Text>
        <Text style={{ color: theme.textSecondary }}>
          {vehicle.colour} · {vehicle.vehicleType}
        </Text>
        {/* Wired up to the guess form in #2. */}
        <Pressable
          disabled
          accessibilityLabel="Guess the stats"
          accessibilityState={{ disabled: true }}
          style={[styles.button, { backgroundColor: theme.backgroundSelected }]}>
          <Text style={{ color: theme.textSecondary }}>Guess the stats</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: theme.text }]}>Play</Text>
        <TextInput
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleLookUp}
          placeholder="25-HG-RJ"
          placeholderTextColor={theme.textSecondary}
          autoCapitalize="characters"
          autoCorrect={false}
          accessibilityLabel="Licence plate"
          style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
        />
        {inputError && <Text style={[styles.inputError, { color: theme.text }]}>{inputError}</Text>}
        <Pressable
          onPress={handleLookUp}
          accessibilityLabel="Look up"
          style={[styles.button, { backgroundColor: theme.badge }]}>
          <Text style={{ color: theme.badgeText }}>Look up</Text>
        </Pressable>
        {renderResult()}
        {plate !== null && coords === null && (
          <Text style={{ color: theme.textSecondary }}>
            Location unavailable, this round won&apos;t show on the map
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.three, gap: Spacing.three },
  title: { fontSize: 28, fontWeight: 'bold' },
  input: { fontSize: 20, padding: Spacing.three, borderRadius: Radius.m },
  inputError: { fontWeight: 'bold' },
  button: {
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.s,
  },
  card: { padding: Spacing.three, borderRadius: Radius.m, gap: Spacing.two },
  make: { fontSize: 22, fontWeight: 'bold' },
});
