import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { clampToRange, parseNumber, type Range } from '@/lib/stats';

type Props = {
  label: string;
  unit: string;
  range: Range;
  value: number | null;
  onChange: (value: number | null) => void;
};

// A number field that keeps its own text, so half-typed numbers ("2" on the way to "2005")
// are not clamped until the field loses focus.
export function StatInput({ label, unit, range, value, onChange }: Props) {
  const theme = useTheme();
  const [text, setText] = useState(value === null ? '' : String(value));

  function handleChangeText(newText: string) {
    setText(newText);
    const number = parseNumber(newText);
    if (newText.trim() === '') onChange(null);
    else if (number !== null && number >= range.min && number <= range.max) onChange(number);
  }

  function handleBlur() {
    const number = parseNumber(text);
    if (number === null) {
      setText(value === null ? '' : String(value));
      return;
    }
    const clamped = clampToRange(number, range);
    setText(String(clamped));
    onChange(clamped);
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <View style={styles.row}>
        <TextInput
          value={text}
          onChangeText={handleChangeText}
          onBlur={handleBlur}
          keyboardType={range.step < 1 ? 'decimal-pad' : 'number-pad'}
          accessibilityLabel={label}
          style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
        />
        {unit !== '' && <Text style={{ color: theme.textSecondary }}>{unit}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.two },
  label: { fontWeight: 'bold' },
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: Spacing.two },
  input: { minWidth: 100, fontSize: 18, padding: Spacing.two, borderRadius: Radius.s },
});
