import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "f1.db");
const db = new Database(dbPath);

export function initDb() {
  db.pragma("foreign_keys = ON");
  db.exec(`
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_name TEXT NOT NULL,
      logo_url TEXT,
      base_country TEXT,
      championships INTEGER DEFAULT 0,
      active_years TEXT
    );

    CREATE TABLE IF NOT EXISTS drivers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      nationality TEXT,
      birthdate TEXT,
      profile_image_url TEXT,
      championships INTEGER DEFAULT 0,
      wins INTEGER DEFAULT 0,
      podiums INTEGER DEFAULT 0,
      poles INTEGER DEFAULT 0,
      fastest_laps INTEGER DEFAULT 0,
      biography TEXT
    );

    CREATE TABLE IF NOT EXISTS driver_teams (
      driver_id INTEGER NOT NULL,
      team_id INTEGER NOT NULL,
      PRIMARY KEY (driver_id, team_id),
      FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE,
      FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS circuits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      circuit_name TEXT NOT NULL,
      country TEXT,
      track_layout_url TEXT,
      lap_length_km REAL,
      first_gp_year INTEGER
    );

    CREATE TABLE IF NOT EXISTS seasons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER NOT NULL,
      champion_driver_id INTEGER,
      champion_team_id INTEGER,
      total_races INTEGER DEFAULT 0,
      banner_image_url TEXT,
      FOREIGN KEY (champion_driver_id) REFERENCES drivers(id) ON DELETE SET NULL,
      FOREIGN KEY (champion_team_id) REFERENCES teams(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS races (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      season_id INTEGER NOT NULL,
      circuit_id INTEGER NOT NULL,
      winner_driver_id INTEGER,
      second_driver_id INTEGER,
      third_driver_id INTEGER,
      fastest_lap_driver_id INTEGER,
      laps INTEGER,
      FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE,
      FOREIGN KEY (circuit_id) REFERENCES circuits(id) ON DELETE CASCADE,
      FOREIGN KEY (winner_driver_id) REFERENCES drivers(id) ON DELETE SET NULL,
      FOREIGN KEY (second_driver_id) REFERENCES drivers(id) ON DELETE SET NULL,
      FOREIGN KEY (third_driver_id) REFERENCES drivers(id) ON DELETE SET NULL,
      FOREIGN KEY (fastest_lap_driver_id) REFERENCES drivers(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      category TEXT,
      caption TEXT
    );
  `);
}

initDb();

export default db;
