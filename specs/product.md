# Kentekenquiz

A car guessing game for players in the Netherlands. You see a car on the
street, type in its licence plate, and guess its stats: year, weight, power,
fuel and engine. You score points for how close you get. Every round is kept
with the place where you spotted the car, so you can see your history, your
high score and a map of your rounds.

## Core action

Enter a plate and guess the car's stats.

## Features

1. [Plate lookup](./features/01-plate-lookup.md): type a plate, see the vehicle, location captured.
2. [Guess form](./features/02-guess-form.md): guess up to six stats with number fields and radio buttons.
3. [Score and result](./features/03-score-result.md): real values next to your guesses, 0-100 per stat and a total; the round is saved.
4. [History](./features/04-history.md): past rounds, high score, round detail, delete a round.
5. [Map](./features/05-map.md): all rounds as pins on one map.

## Data

- **API**: [RDW Open Data](https://opendata.rdw.nl/), no key, no login.
- **Endpoints**:
  - `https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=<PLATE>` (Gekentekende voertuigen): make, model, colour, vehicle type, `datum_eerste_toelating`, `massa_ledig_voertuig`, `cilinderinhoud`, `aantal_cilinders`.
  - `https://opendata.rdw.nl/resource/8ys7-d773.json?kenteken=<PLATE>` (Brandstof): one row per fuel, `brandstof_omschrijving`, `nettomaximumvermogen` (kW), `nominaal_continu_maximumvermogen` (kW, electric).
  - An unknown plate returns `[]`, not an error.
- **Stored on the phone**: one row per round in SQLite: id, plate, make, model,
  per stat the guess and the real value (empty when the stat was skipped),
  per stat score, total score, played-at date, latitude and longitude (empty
  when location was unavailable).

## Technical choices

- **Stored in SQLite**: the rounds. The assignment requires SQLite, and a round
  is structured data with fixed columns, which fits a table. Alternative:
  AsyncStorage, a key-value store where all rounds would live in one JSON blob.
- **Native feature**: location (expo-location), captured when a plate is looked
  up, and shown on the Map tab. Alternative: the camera, to take a photo of the
  car. It costs storage and adds nothing to the scoring, while the location
  feeds the map.

## Technical core

- [ ] Runs in Expo Go
- [ ] Live data through TanStack Query
- [ ] At least 2 screens with Expo Router
- [ ] Something in SQLite that survives a restart
- [ ] Loading and error state on every load
- [ ] One native feature: location, captured on plate lookup, shown on the Map tab
- [ ] TypeScript and ESLint without errors
- [ ] UI, data and logic in separate files

## Optional

- [ ] Clean TypeScript: no `any`, no `as` casts, no `@ts-ignore`
- [ ] No warnings: no `console.log`, none in the terminal or on screen
- [ ] Dark mode: every screen looks right, all colours from the theme
- [ ] Design: a consistent own style with your own font
- [ ] Accessibility: button labels, largest text size

## Out of scope

- Accounts, online leaderboards, multiplayer.
- A web version.
- APIs other than RDW Open Data.
- Catalogue price as a stat.
- Editing a round after it is saved.
- Localization: the UI is English only.
