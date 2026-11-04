import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { ErrorView } from '@/components/error-view';
import { StatInput } from '@/components/stat-input';
import { Radius, Spacing } from '@/constants/theme';
import { useSaveRound } from '@/hooks/use-save-round';
import { useTheme } from '@/hooks/use-theme';
import { scoreRound } from '@/lib/scoring';
import {
  FUEL_ANSWERS,
  type FuelAnswer,
  NUMBER_FIELDS,
  NUMBER_RANGES,
  type NumberStat,
  realValues,
} from '@/lib/stats';
import { parseCoordsParams, parseVehicleParam } from '@/lib/vehicle';
import type { Coords } from '@/services/location';
import type { Vehicle } from '@/services/rdw';

export default function GuessScreen() {
  const theme = useTheme();
  const { vehicle: param, latitude, longitude } = useLocalSearchParams();
  const vehicle = parseVehicleParam(param);

  if (vehicle === null) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Could not read this vehicle, go back and look it up again</Text>
      </View>
    );
  }
  return <GuessForm vehicle={vehicle} coords={parseCoordsParams(latitude, longitude)} />;
}

// Separate component so its hooks only run once there is a vehicle.
function GuessForm({ vehicle, coords }: { vehicle: Vehicle; coords: Coords | null }) {
  const theme = useTheme();
  const save = useSaveRound();
  // Set synchronously on the first tap: `disabled` only applies after a re-render, so a quick
  // double tap would otherwise save the round twice.
  const submitting = useRef(false);
  const real = realValues(vehicle);
  const [guesses, setGuesses] = useState<Record<NumberStat, number | null>>({
    year: null,
    weight: null,
    power: null,
    litres: null,
    cylinders: null,
  });
  const [fuel, setFuel] = useState<FuelAnswer | null>(null);

  const askedFields = NUMBER_FIELDS.filter((field) => real[field.stat] !== null);
  const nothingAsked = askedFields.length === 0 && real.fuel === null;
  const canSubmit =
    !nothingAsked &&
    askedFields.every((field) => guesses[field.stat] !== null) &&
    (real.fuel === null || fuel !== null);

  function handleSubmit() {
    if (submitting.current) return;
    submitting.current = true;
    const allGuesses = { ...guesses, fuel };
    const { scores, total } = scoreRound(real, allGuesses);
    save.mutate(
      {
        plate: vehicle.plate,
        make: vehicle.make,
        model: vehicle.model,
        playedAt: new Date().toISOString(),
        coords,
        real,
        guesses: allGuesses,
        scores,
        total,
      },
      {
        // replace, not push: the form is gone, so Submit cannot be tapped again.
        onSuccess: (id) => router.replace({ pathname: '/result', params: { id: String(id) } }),
        // The insert is one statement, so a failed save left no row; "Try again" is safe.
        onError: () => {
          submitting.current = false;
        },
      },
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled">
      <View>
        <Text style={[styles.make, { color: theme.text }]}>{vehicle.make}</Text>
        <Text style={{ color: theme.text }}>{vehicle.model}</Text>
      </View>

      {askedFields.map((field) => (
        <StatInput
          key={field.stat}
          label={field.label}
          unit={field.unit}
          range={NUMBER_RANGES[field.stat]}
          value={guesses[field.stat]}
          onChange={(value) => setGuesses((current) => ({ ...current, [field.stat]: value }))}
        />
      ))}

      {real.fuel !== null && (
        <View style={styles.fuel} accessibilityRole="radiogroup">
          <Text style={[styles.label, { color: theme.text }]}>Fuel</Text>
          {FUEL_ANSWERS.map((answer) => {
            const selected = fuel === answer;
            return (
              <Pressable
                key={answer}
                onPress={() => setFuel(answer)}
                accessibilityRole="radio"
                accessibilityLabel={answer}
                accessibilityState={{ checked: selected }}
                style={[
                  styles.radio,
                  { backgroundColor: selected ? theme.badge : theme.backgroundElement },
                ]}>
                <Text style={{ color: selected ? theme.badgeText : theme.text }}>{answer}</Text>
              </Pressable>
            );
          })}
        </View>
      )}

      <Button
        label={save.isPending ? 'Saving…' : 'Submit'}
        onPress={handleSubmit}
        disabled={!canSubmit || save.isPending}
      />
      {save.isError && (
        <ErrorView message={`Could not save the round: ${save.error.message}`} onRetry={handleSubmit} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.three },
  content: { padding: Spacing.three, gap: Spacing.four },
  make: { fontSize: 22, fontWeight: 'bold' },
  label: { fontWeight: 'bold' },
  fuel: { gap: Spacing.two },
  radio: { paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, borderRadius: Radius.s },
});
