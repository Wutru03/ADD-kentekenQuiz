# Guess form

## Goal

Guess the stats of the car I just looked up, quickly, with controls that fit
each stat.

## Constraints

- Second step of the Play stack, after a found vehicle (feature 1).
- Sliders with `@react-native-community/slider` (install with `npx expo install`).
- Which stats are asked, and their real values, come from pure logic in its own file (also used by feature 3). A stat whose real value is missing is not asked.
- Real values, from the RDW data:

  | Stat | Source | Unit / rounding |
  |---|---|---|
  | Year | `datum_eerste_toelating` | year |
  | Empty weight | `massa_ledig_voertuig` | kg |
  | Power | `nettomaximumvermogen` of the Benzine/Diesel/LPG row; pure EV: `nominaal_continu_maximumvermogen` | pk = kW × 1.36, rounded to a whole number |
  | Cylinder capacity | `cilinderinhoud` | litres, cc / 1000 rounded to 1 decimal |
  | Cylinders | `aantal_cilinders` | count |
  | Fuel | `brandstof_omschrijving` of all rows | see below |

- Fuel answer: Elektriciteit plus Benzine or Diesel = Hybrid. Only Elektriciteit = Electric. Contains LPG = LPG. Only Benzine = Petrol. Only Diesel = Diesel. Anything else (Waterstof, CNG, other combinations) = fuel not asked.
- Colours and spacing from `src/constants/theme.ts`.

## Acceptance Criteria

- [ ] The car's make and model are shown above the form.
- [ ] Inputs per stat:
  - Year: number field, 1900 to the current year.
  - Weight: slider 400-4000 kg (step 10) and a number field, kept in sync.
  - Power: slider 0-800 pk (step 1) and a number field, kept in sync.
  - Cylinder capacity: number field, 0.0-8.0 L (1 decimal).
  - Cylinders: slider 0-16 (step 1) and a number field, kept in sync.
  - Fuel: radio buttons Petrol, Diesel, Electric, LPG, Hybrid.
- [ ] Sliders start in the middle of their range; number fields without a slider and fuel start empty.
- [ ] A number outside its range is clamped to the nearest min or max (and moves its slider).
- [ ] Stats with a missing real value are not shown.
- [ ] "Submit" is disabled until every shown stat has a value.

## Out of Scope

- Hints or a timer.
- Changing guesses after submit.
- Catalogue price.
