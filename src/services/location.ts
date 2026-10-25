import * as Location from 'expo-location';

export type Coords = { latitude: number; longitude: number };

// Null when permission is denied or there is no fix; the round continues without coordinates.
export async function getCurrentCoords(): Promise<Coords | null> {
  try {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) return null;
    const { coords } = await Location.getCurrentPositionAsync();
    return { latitude: coords.latitude, longitude: coords.longitude };
  } catch {
    return null;
  }
}
