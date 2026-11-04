import type { Coords } from '@/services/location';
import type { StoredRound } from '@/services/rounds';

export type Pin = { id: number; coords: Coords };
export type MapRegion = Coords & { latitudeDelta: number; longitudeDelta: number };

const METRES_PER_DEGREE = 111_320;
// Rounds closer together than this grid cell (about 20 m) share a spot.
const SPOT_DEGREES = 0.0002;
// Distance between neighbouring pins on a spread ring; about the width of a pin at the minimum zoom.
const PIN_GAP_METRES = 30;
// 0.004 degrees is about 450 m, so one pin (or one spot) never zooms in further than that.
const MIN_SPAN = 0.004;
const MARGIN = 1.4;

// Rounds without coordinates get no pin. Rounds on the same spot are spread on a small ring around it,
// so each of them has its own tappable pin.
export function pinsOf(rounds: StoredRound[]): Pin[] {
  const spots = new Map<string, { id: number; coords: Coords }[]>();
  for (const round of rounds) {
    if (round.coords === null) continue;
    // ponytail: grid cells, so two rounds 10 m apart across a cell edge stay unspread; real distance grouping if that shows
    const key = `${Math.round(round.coords.latitude / SPOT_DEGREES)},${Math.round(round.coords.longitude / SPOT_DEGREES)}`;
    spots.set(key, [...(spots.get(key) ?? []), { id: round.id, coords: round.coords }]);
  }
  return [...spots.values()].flatMap(spreadSpot);
}

// One round stays where it was; more are placed evenly on a ring around their mean position.
function spreadSpot(spot: { id: number; coords: Coords }[]): Pin[] {
  if (spot.length === 1) return spot;
  const latitude = spot.reduce((sum, pin) => sum + pin.coords.latitude, 0) / spot.length;
  const longitude = spot.reduce((sum, pin) => sum + pin.coords.longitude, 0) / spot.length;
  const radius = PIN_GAP_METRES / 2 / Math.sin(Math.PI / spot.length);
  const latitudeStep = radius / METRES_PER_DEGREE;
  const longitudeStep = latitudeStep / Math.cos((latitude * Math.PI) / 180);
  return [...spot]
    .sort((a, b) => a.id - b.id)
    .map((pin, index) => {
      const angle = (2 * Math.PI * index) / spot.length;
      return {
        id: pin.id,
        coords: {
          latitude: latitude + latitudeStep * Math.cos(angle),
          longitude: longitude + longitudeStep * Math.sin(angle),
        },
      };
    });
}

// The region that shows all pins; null when there are none.
export function regionFor(pins: Pin[]): MapRegion | null {
  if (pins.length === 0) return null;
  const latitudes = pins.map((pin) => pin.coords.latitude);
  const longitudes = pins.map((pin) => pin.coords.longitude);
  const south = Math.min(...latitudes);
  const north = Math.max(...latitudes);
  const west = Math.min(...longitudes);
  const east = Math.max(...longitudes);
  return {
    latitude: (south + north) / 2,
    longitude: (west + east) / 2,
    latitudeDelta: Math.max((north - south) * MARGIN, MIN_SPAN),
    longitudeDelta: Math.max((east - west) * MARGIN, MIN_SPAN),
  };
}
