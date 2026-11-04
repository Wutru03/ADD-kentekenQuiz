import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const FILL_MS = 500;

type Props = { score: number; delay: number };

// A bar that fills from 0 to `score` (0-100) once, `delay` ms after it appears.
// Reanimated skips the animation when the phone has "reduce motion" on.
export function ScoreBar({ score, delay }: Props) {
  const theme = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.set(withDelay(delay, withTiming(score / 100, { duration: FILL_MS })));
  }, [progress, score, delay]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.get() * 100}%` }));

  return (
    <View style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
      <Animated.View style={[styles.fill, { backgroundColor: theme.badge }, fillStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: Spacing.three, borderRadius: Radius.s, overflow: 'hidden' },
  fill: { height: '100%' },
});
