import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { ErrorView } from '@/components/error-view';
import { Radius, Spacing } from '@/constants/theme';
import { usePlateLookup } from '@/hooks/use-plate-lookup';
import { useTheme } from '@/hooks/use-theme';
import { isValidPlate, normalisePlate } from '@/lib/plate';
import type { Vehicle } from '@/services/rdw';

// "Play again" comes back here with a new roundKey; a new key remounts the form, so it starts empty.
export default function PlayScreen() {
  const { roundKey } = useLocalSearchParams<{ roundKey?: string }>();
  return <PlayForm key={roundKey} />;
}

function PlayForm() {
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

  function handleGuess(vehicle: Vehicle) {
    // The coordinates travel as string params; left out when the location is unavailable.
    const location = coords ? { latitude: String(coords.latitude), longitude: String(coords.longitude) } : {};
    router.push({ pathname: '/guess', params: { vehicle: JSON.stringify(vehicle), ...location } });
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
        {/* undefined = the location is still being looked up; wait, so the round gets its coordinates. */}
        <Button label="Guess the stats" onPress={() => handleGuess(vehicle)} disabled={coords === undefined} />
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
        {inputError && <Text style={[styles.inputError, { color: theme.error }]}>{inputError}</Text>}
        <Button label="Look up" onPress={handleLookUp} />
        {renderResult()}
        {plate !== null && coords === undefined && (
          <Text style={{ color: theme.textSecondary }}>Getting location…</Text>
        )}
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
  card: { padding: Spacing.three, borderRadius: Radius.m, gap: Spacing.two },
  make: { fontSize: 22, fontWeight: 'bold' },
});
