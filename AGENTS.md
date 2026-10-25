# Kentekenquiz

A Dutch licence-plate guessing game: the player types a plate, guesses the vehicle's stats, and scores 0-100 per stat. Live data from RDW Open Data (no key).

- Expo Router, TanStack Query, expo-sqlite. Must run in Expo Go.
- Screens in `src/app/`, data through hooks in `src/hooks/`, API and SQL in `src/services/`. Pure logic (plate normalising, real values, scoring) in `src/lib/`, without React.
- Never force-push, squash or rewrite history. My git history is part of my hand-in.

## Specs

- `specs/product.md` says what the app is; `specs/features/*.md` say what each feature does. The spec is the source of truth: do not build what is not in it. If the spec is unclear or wrong, ask me, do not guess.
- Each feature is one GitHub issue. Work on one issue per chat.

## Workflow per issue

1. Read the issue and its spec file. Touch only the files the issue needs. `src/lib/` is always allowed for the issue's pure logic, even if my prompt does not list it.
2. Post a plan with a `- [ ]` task list as a comment on the issue (`gh issue comment <n>`). Stop and wait for my go.
3. Build in small steps and tick off the tasks on the issue.
4. Run `npx expo lint` and `npx tsc --noEmit` before saying you are done.
5. Explain what you built when I ask, line by line if needed.
6. I commit myself with `closes #<n>`. Do not add AI attribution to commits.

## Rules

- Install a dependency only when the issue's spec names it, with `npx expo install`. Everything must work in Expo Go.
- RDW returns every value as a string and an unknown plate as `[]`. Parse in the service, so hooks and screens get typed numbers and `null` for missing values.
- Every query has a loading state and an error state with a "Try again" button (`src/components/error-view.tsx`).
- UI text in English. RDW's Dutch values (Personenauto, BLAUW, ...) are shown as-is; do not add translation unless the issue's spec asks for it.
- Clean TypeScript: no `any`, no `as` casts (`as const` is fine), no `@ts-ignore`, no non-null `!`.
- No `console.log`, no warnings in the terminal or on screen.
- All colours from `src/constants/theme.ts` through `useTheme()`, never hard-coded hex in a screen or component. Every screen must look right in light and dark mode.
- Spacing and radius from `Spacing` and `Radius` in the theme.
- Every pressable and input has an `accessibilityLabel`; layouts must survive the largest text size.
- `tsc` needs `expo-env.d.ts`, which `npx expo start` generates. It is gitignored on purpose.

---

This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md
