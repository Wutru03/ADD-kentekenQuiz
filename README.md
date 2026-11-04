# Kentekenquiz

See a car, type its Dutch licence plate, and guess its year, weight, power, fuel and engine. Score 0-100 per stat, and see your history and a map of where you played. Data from [RDW Open Data](https://opendata.rdw.nl/), no key needed.

Final assignment for Frontend Development (Inholland), React Native part.

## Run

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go.

On Android, if Expo Go shows `Cannot find native module 'ExpoSQLite'`, force stop Expo Go and scan again. This seems to happen when Expo Go still has another project open.

## Check

```bash
npx expo lint
npx tsc --noEmit
```

## Docs

- [Product spec](./specs/product.md) and [feature specs](./specs/features/)
- [AGENTS.md](./AGENTS.md): instructions for the coding agent
- [Explanation](./docs/explanation.md)
- [Chat history](./chat-history/)
