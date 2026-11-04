# Explanation - Kentekenquiz

**Route:** Own idea. **Tools:** Claude Code. For issues 3 to 5, a separate planning chat wrote the first prompt, and I decided on each plan in that issue's own chat.

## 1. Your technical choices

**Stored in SQLite: the rounds.** The table is created in `src/services/database.ts:18`, and `insertRound` in `src/services/rounds.ts:52` saves a round when I press Submit. I picked a table because a round has fixed columns. The alternative was AsyncStorage, where all rounds would sit in one JSON blob. This choice did not change. One thing came up while building: `id` has no `AUTOINCREMENT`, so after deleting the newest round the next round gets the same id. That is why `src/hooks/use-delete-round.ts:13` also removes the deleted round from the cache.

**Native feature: location.** `getCurrentCoords` in `src/services/location.ts:8` asks for permission and gets the position when a plate is looked up. The position is saved with the round and shown as a pin in `src/app/(tabs)/map.tsx:64`. The alternative was the camera, but a photo costs storage and adds nothing to the scoring, while the location feeds the map. The choice stayed, but in issue 3 I approved a 10-second limit (`src/services/location.ts:14`). "Guess the stats" now waits for the location, so without a limit, having no GPS fix indoors could keep that button disabled for a long time.

## 2. Pick one feature and explain how it works, from API call to screen.

**Plate lookup.** `handleLookUp` in `src/app/(tabs)/(play)/index.tsx:26` cleans the input and checks it with `src/lib/plate.ts`. A wrong plate shows an inline error and sends no request. A valid plate goes to `lookUp` in `src/hooks/use-plate-lookup.ts:19`, which sets the plate and starts getting the location.

Setting the plate starts the `useQuery` at `src/hooks/use-plate-lookup.ts:12`. It calls `fetchVehicle` in `src/services/rdw.ts:53`, which fetches both RDW endpoints at once. RDW returns every value as a string, so the service turns them into a typed `Vehicle`, with numbers, and `null` for missing values. An unknown plate returns `[]`, which becomes `null`. TanStack Query caches the result per plate, so looking up the same plate again shows the vehicle straight away while it refreshes.

`renderResult` at `src/app/(tabs)/(play)/index.tsx:42` picks what to show: a spinner while loading, `ErrorView` (`src/components/error-view.tsx`) with "Try again" on an error, "No vehicle found for this plate" for `null`, and otherwise the vehicle card. "Guess the stats" on that card stays disabled until the location is known.

## 3. Name a suggestion from the agent that you rejected or changed.

In the plan for issue 1, the agent added a file to translate RDW's Dutch vehicle types and colours into English. I noticed it while reading the plan, before any code existed, and said no. It was not part of that issue's scope, so the values stay in Dutch. The plan comment on issue 1 records this, it became a rule in `AGENTS.md:29`, and the commit is `e6c3ad4`.
