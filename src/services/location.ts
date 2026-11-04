import * as Location from 'expo-location';

export type Coords = { latitude: number; longitude: number };

const FIX_TIMEOUT_MS = 10_000;

// Null when permission is denied or there is no fix in time; the round continues without coordinates.
export async function getCurrentCoords(): Promise<Coords | null> {
  try {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) return null;
    // Without a cap, no fix (indoors) would keep "Guess the stats" disabled for a long time.
    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), FIX_TIMEOUT_MS));
    const position = await Promise.race([Location.getCurrentPositionAsync(), timeout]);
    if (position === null) return null;
    return { latitude: position.coords.latitude, longitude: position.coords.longitude };
  } catch {
    return null;
  }
}
