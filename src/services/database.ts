import type { SQLiteDatabase } from 'expo-sqlite';

export const DATABASE_NAME = 'kentekenquiz.db';

// Bump this and add an `if (version === n)` step below when the table changes.
const DATABASE_VERSION = 1;

// Runs once before the app renders (SQLiteProvider onInit). PRAGMA user_version stores the schema version.
// One wide table: per stat a guess, the real value and a score, all NULL when the stat was not asked.
export async function migrate(db: SQLiteDatabase) {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const version = row?.user_version ?? 0;
  if (version >= DATABASE_VERSION) return;

  if (version === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS rounds (
        id INTEGER PRIMARY KEY NOT NULL,
        plate TEXT NOT NULL,
        make TEXT NOT NULL,
        model TEXT NOT NULL,
        played_at TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        total_score INTEGER NOT NULL,
        year_guess REAL, year_real REAL, year_score INTEGER,
        weight_guess REAL, weight_real REAL, weight_score INTEGER,
        power_guess REAL, power_real REAL, power_score INTEGER,
        litres_guess REAL, litres_real REAL, litres_score INTEGER,
        cylinders_guess REAL, cylinders_real REAL, cylinders_score INTEGER,
        fuel_guess TEXT, fuel_real TEXT, fuel_score INTEGER
      );
    `);
  }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
