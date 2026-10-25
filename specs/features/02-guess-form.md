# Guess form

## Goal

Guess the stats of the car I just looked up, quickly, with controls that fit
each stat.

## Constraints

- Second step of the Play stack, after a found vehicle (feature 1). The Play tab becomes a Stack; the found vehicle is passed to the guess screen as a JSON route param and checked with a type guard. An invalid param shows an error.
- Every number stat is a plain number field (no sliders), so any exact value can be typed, also for vehicles far outside a normal car's range.
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
  - Weight: number field, whole kg, 0 or more.
  - Power: number field, whole pk, 0 or more.
  - Cylinder capacity: number field, 0.0-8.0 L (1 decimal).
  - Cylinders: number field, whole number, 0 or more.
  - Fuel: radio buttons Petrol, Diesel, Electric, LPG, Hybrid.
- [ ] All number fields and fuel start empty.
- [ ] When a field loses focus, a number outside its range is clamped to the nearest min or max and rounded to its step (whole number, or 1 decimal for litres).
- [ ] Stats with a missing real value are not shown.
- [ ] "Submit" is disabled until every shown stat has a value. What Submit does is feature 3.

## Out of Scope

- Hints or a timer.
- Changing guesses after submit.
- Catalogue price.
