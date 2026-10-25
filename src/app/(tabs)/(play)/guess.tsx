import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { StatInput } from '@/components/stat-input';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { FUEL_ANSWERS, type FuelAnswer, NUMBER_RANGES, type NumberStat, realValues } from '@/lib/stats';
import { parseVehicleParam } from '@/lib/vehicle';
import type { Vehicle } from '@/services/rdw';

const NUMBER_FIELDS: { stat: NumberStat; label: string; unit: string }[] = [
  { stat: 'year', label: 'Year', unit: '' },
  { stat: 'weight', label: 'Empty weight', unit: 'kg' },
  { stat: 'power', label: 'Power', unit: 'pk' },
  { stat: 'litres', label: 'Cylinder capacity', unit: 'L' },
  { stat: 'cylinders', label: 'Cylinders', unit: '' },
];

export default function GuessScreen() {
  const theme = useTheme();
  const { vehicle: param } = useLocalSearchParams();
  const vehicle = parseVehicleParam(param);

  if (vehicle === null) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Could not read this vehicle, go back and look it up again</Text>
      </View>
    );
  }
  return <GuessForm vehicle={vehicle} />;
}

// Separate component so its hooks only run once there is a vehicle.
function GuessForm({ vehicle }: { vehicle: Vehicle }) {
  const theme = useTheme();
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
  const canSubmit =
    askedFields.every((field) => guesses[field.stat] !== null) && (real.fuel === null || fuel !== null);

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

      {/* What Submit does is #3. */}
      <Pressable
        disabled={!canSubmit}
        accessibilityLabel="Submit"
        accessibilityState={{ disabled: !canSubmit }}
        style={[styles.button, { backgroundColor: canSubmit ? theme.badge : theme.backgroundSelected }]}>
        <Text style={{ color: canSubmit ? theme.badgeText : theme.textSecondary }}>Submit</Text>
      </Pressable>
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
  button: {
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.s,
  },
});
