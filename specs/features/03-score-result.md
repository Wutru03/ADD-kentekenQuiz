# Score and result

## Goal

See how close my guesses were, per stat and in total, and keep the round.

## Constraints

- Third step of the Play stack, after submit (feature 2).
- Scoring is pure logic in its own file, no React.
- Number stats: score = 100 × (1 − |guess − real| / range), minimum 0, rounded to a whole number. Range per stat: year 8, weight 400 kg, power 80 pk, cylinder capacity 0.5 L, cylinders 2.
- Fuel: correct = 100, wrong = 0.
- Total = average of the stats that were asked, rounded, 0-100.
- The round is saved in SQLite (`expo-sqlite`) on submit, with the location from feature 1. SQL lives in `src/services/`, the hook in `src/hooks/`.
- The result is revealed with Reanimated: each score has a bar that fills from 0 to its score (0-100), one after the other, and the total score is a last bar at the bottom. The screen scrolls along so the bar that is filling is in view. No animation when the phone has "reduce motion" on.

## Acceptance Criteria

- [x] Per asked stat: my guess, the real value, and the score 0-100.
- [x] The total score 0-100, at the bottom, after the per-stat scores.
- [x] Each score has a bar that fills up from 0 to its score, one stat after the other; the total's bar fills last.
- [x] The screen scrolls so each bar is in view while it fills.
- [x] The round is in SQLite after submit and is still there after an app restart.
- [x] The result shows "Round #<id> saved", with the id from the database.
- [x] Leaving the form without submitting saves nothing.
- [x] Playing the same plate again makes a new round.
- [x] A "Play again" button goes back to an empty plate field.
- [x] A failed save shows an error with "Try again".

## Out of Scope

- Sharing the score.
- Bonus points or streaks.
