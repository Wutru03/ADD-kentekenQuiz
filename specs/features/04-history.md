# History

## Goal

Look back at the cars I played, see my high score, and open or delete a round.

## Constraints

- History tab, `src/app/(tabs)/history.tsx`, and a round detail stack screen `src/app/round/[id].tsx`.
- Reads the rounds from SQLite (feature 3) through TanStack Query hooks; delete is a mutation that refreshes the list.
- The detail shares its stat rows with the result screen (feature 3); its bars fill together, without the one-by-one reveal.
- Dates are shown as "4 Nov 2026, 14:05": English, in the phone's time zone.
- Colours and spacing from `src/constants/theme.ts`.

## Acceptance Criteria

- [x] The high score (highest total) on top.
- [x] Rounds newest first: make and model, plate, total score, date.
- [x] No rounds yet shows an empty state "No rounds yet. Look up a plate to play."
- [x] Tapping a round opens its detail: per stat guess, real value and score, plus the total, date and plate.
- [x] The detail has "Delete round"; it asks for confirmation, then removes the round and goes back. List and high score update.
- [x] A round with coordinates has a "View on map" button that opens the Map tab with that round's card, zoomed to its pin (feature 5). A round without coordinates has no button.
- [x] Loading and error state on the list and the detail.

## Out of Scope

- Clearing all history at once.
- Filtering or sorting options.
- Editing a round.
