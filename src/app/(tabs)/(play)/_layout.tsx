import { Stack } from 'expo-router';

// Play tab: plate lookup -> guess form -> result.
export default function PlayLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="guess" options={{ title: 'Guess' }} />
      {/* The only way out is "Play again", so no back button or swipe back. */}
      <Stack.Screen name="result" options={{ title: 'Result', headerBackVisible: false, gestureEnabled: false }} />
    </Stack>
  );
}
