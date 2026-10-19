# Plate lookup

## Goal

Type in the plate of a car I see on the street and get that vehicle, so I can
start a round. The place where I look it up is remembered for the map.

## Constraints

- Lives on the Play tab, `src/app/(tabs)/index.tsx`, the first step of the Play stack.
- Both RDW endpoints (`m9d7-ebf2` and `8ys7-d773`) through TanStack Query, keyed on the normalised plate. Fetch code in `src/services/`, hook in `src/hooks/`.
- Any vehicle type is allowed (car, motorbike, truck, ...).
- Location with `expo-location` (install with `npx expo install`), foreground permission only, asked the first time a plate is looked up.
- Normalising and validating the plate is pure logic, outside the screen.
- Colours and spacing from `src/constants/theme.ts`.

## Acceptance Criteria

- [ ] A text field for the plate and a "Look up" button.
- [ ] Input is normalised before use: uppercase, everything but letters and digits removed (`25-hg-rj` becomes `25HGRJ`).
- [ ] After normalising, anything other than exactly 6 letters/digits shows an inline error "A Dutch plate has 6 letters and digits" and sends no request.
- [ ] A plate the API does not know (`[]`) shows "No vehicle found for this plate".
- [ ] While loading a spinner is shown; a network error shows the message and a "Try again" button.
- [ ] A found vehicle shows make, model, first colour and vehicle type, then the player continues to the guess form.
- [ ] On lookup the current location is captured. Permission denied or no fix shows the note "Location unavailable, this round won't show on the map" and the game continues without coordinates.

## Out of Scope

- Validating Dutch sidecodes (XX-99-99 etc.).
- Scanning the plate with the camera.
- Recent plates or suggestions.
