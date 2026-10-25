import { Stack } from 'expo-router';

// Play tab: plate lookup -> guess form (-> result in #3).
export default function PlayLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="guess" options={{ title: 'Guess' }} />
    </Stack>
  );
}
