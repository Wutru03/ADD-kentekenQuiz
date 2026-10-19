# History

## Goal

Look back at the cars I played, see my high score, and open or delete a round.

## Constraints

- History tab, `src/app/(tabs)/history.tsx`, and a round detail stack screen `src/app/round/[id].tsx`.
- Reads the rounds from SQLite (feature 3) through TanStack Query hooks; delete is a mutation that refreshes the list.
- Colours and spacing from `src/constants/theme.ts`.

## Acceptance Criteria

- [ ] The high score (highest total) on top.
- [ ] Rounds newest first: make and model, plate, total score, date.
- [ ] No rounds yet shows an empty state "No rounds yet. Look up a plate to play."
- [ ] Tapping a round opens its detail: per stat guess, real value and score, plus the total, date and plate.
- [ ] The detail has "Delete round"; it asks for confirmation, then removes the round and goes back. List and high score update.
- [ ] Loading and error state on the list and the detail.

## Out of Scope

- Clearing all history at once.
- Filtering or sorting options.
- Editing a round.
