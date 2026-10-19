# Map

## Goal

See on one map where I spotted all the cars I played.

## Constraints

- Map tab, `src/app/(tabs)/map.tsx`.
- `react-native-maps` (install with `npx expo install`). Must run in Expo Go.
- Pins from the rounds in SQLite (feature 3) through the same hooks as feature 4. Rounds without coordinates are left out.
- Opens the round detail from feature 4; no second detail screen.

## Acceptance Criteria

- [ ] One pin per round that has coordinates.
- [ ] Tapping a pin shows plate, make and model, and total score.
- [ ] From that pin the round detail (feature 4) opens.
- [ ] The map fits all pins on open.
- [ ] No rounds with coordinates shows an empty state "No rounds with a location yet."
- [ ] Loading and error state while the rounds load.
- [ ] A deleted round disappears from the map.

## Out of Scope

- Clustering pins.
- Directions or distances.
- Filtering pins by score or date.
