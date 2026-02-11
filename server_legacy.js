import express from "express";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const db = new Database(path.join(__dirname, "data.db"));

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

function initDb() {
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

function isHttpsUrl(value) {
  if (!value) return true;
  return /^https:\/\//i.test(String(value).trim());
}

function requireHttpsUrl(value, field, errors) {
  if (!value || !String(value).trim()) return;
  if (!isHttpsUrl(value)) errors.push(`${field} must start with https://`);
}

function requireYear(value, field, errors) {
  if (value === undefined || value === null || value === "") return;
  if (!/^\d{4}$/.test(String(value))) errors.push(`${field} must be 4 digits`);
}

function requireNumber(value, field, errors) {
  if (value === undefined || value === null || value === "") return;
  if (Number.isNaN(Number(value))) errors.push(`${field} must be a number`);
}

function toIntOrNull(value) {
  if (value === undefined || value === null || value === "") return null;
  const num = Number(value);
  if (Number.isNaN(num)) return null;
  return Math.trunc(num);
}

function toFloatOrNull(value) {
  if (value === undefined || value === null || value === "") return null;
  const num = Number(value);
  if (Number.isNaN(num)) return null;
  return num;
}

function validateDriver(body) {
  const errors = [];
  if (!body.name || !String(body.name).trim()) errors.push("name is required");
  ["championships", "wins", "podiums", "poles", "fastest_laps"].forEach((field) =>
    requireNumber(body[field], field, errors)
  );
  requireHttpsUrl(body.profile_image_url, "profile_image_url", errors);
  return errors;
}

function validateTeam(body) {
  const errors = [];
  if (!body.team_name || !String(body.team_name).trim()) errors.push("team_name is required");
  requireNumber(body.championships, "championships", errors);
  requireHttpsUrl(body.logo_url, "logo_url", errors);
  return errors;
}

function validateCircuit(body) {
  const errors = [];
  if (!body.circuit_name || !String(body.circuit_name).trim()) errors.push("circuit_name is required");
  requireNumber(body.lap_length_km, "lap_length_km", errors);
  requireYear(body.first_gp_year, "first_gp_year", errors);
  requireHttpsUrl(body.track_layout_url, "track_layout_url", errors);
  return errors;
}

function validateSeason(body) {
  const errors = [];
  requireYear(body.year, "year", errors);
  if (!body.year) errors.push("year is required");
  requireNumber(body.total_races, "total_races", errors);
  requireHttpsUrl(body.banner_image_url, "banner_image_url", errors);
  return errors;
}

function validateRace(body) {
  const errors = [];
  if (!body.season_id) errors.push("season_id is required");
  if (!body.circuit_id) errors.push("circuit_id is required");
  if (!body.winner_driver_id) errors.push("winner_driver_id is required");
  requireNumber(body.laps, "laps", errors);
  return errors;
}

function validateMedia(body) {
  const errors = [];
  if (!body.title || !String(body.title).trim()) errors.push("title is required");
  if (!body.url || !String(body.url).trim()) errors.push("url is required");
  requireHttpsUrl(body.url, "url", errors);
  return errors;
}

function respondValidation(res, errors) {
  if (errors.length) {
    res.status(400).json({ errors });
    return true;
  }
  return false;
}

function list(table) {
  return db.prepare(`SELECT * FROM ${table} ORDER BY id DESC`).all();
}

function getById(table, id) {
  return db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
}

function removeById(table, id) {
  return db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
}

function setDriverTeams(driverId, teamIds) {
  db.prepare(`DELETE FROM driver_teams WHERE driver_id = ?`).run(driverId);
  if (!Array.isArray(teamIds)) return;
  const insert = db.prepare(`INSERT INTO driver_teams (driver_id, team_id) VALUES (?, ?)`);
  const tx = db.transaction((ids) => {
    ids.filter((id) => id).forEach((teamId) => insert.run(driverId, teamId));
  });
  tx(teamIds);
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Drivers
app.get("/api/drivers", (req, res) => {
  const rows = list("drivers");
  const teamLinks = db.prepare(`SELECT * FROM driver_teams`).all();
  const map = new Map();
  teamLinks.forEach((link) => {
    if (!map.has(link.driver_id)) map.set(link.driver_id, []);
    map.get(link.driver_id).push(link.team_id);
  });
  res.json(rows.map((row) => ({ ...row, team_ids: map.get(row.id) || [] })));
});

app.get("/api/drivers/:id", (req, res) => {
  const row = getById("drivers", req.params.id);
  if (!row) return res.status(404).json({ error: "Not found" });
  const teamIds = db
    .prepare(`SELECT team_id FROM driver_teams WHERE driver_id = ?`)
    .all(req.params.id)
    .map((r) => r.team_id);
  res.json({ ...row, team_ids: teamIds });
});

app.post("/api/drivers", (req, res) => {
  const errors = validateDriver(req.body);
  if (respondValidation(res, errors)) return;
  const stmt = db.prepare(`
    INSERT INTO drivers (name, nationality, birthdate, profile_image_url, championships, wins, podiums, poles, fastest_laps, biography)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    req.body.name,
    req.body.nationality || "",
    req.body.birthdate || "",
    req.body.profile_image_url || "",
    toIntOrNull(req.body.championships) ?? 0,
    toIntOrNull(req.body.wins) ?? 0,
    toIntOrNull(req.body.podiums) ?? 0,
    toIntOrNull(req.body.poles) ?? 0,
    toIntOrNull(req.body.fastest_laps) ?? 0,
    req.body.biography || ""
  );
  const id = info.lastInsertRowid;
  setDriverTeams(id, req.body.team_ids || []);
  res.json(getById("drivers", id));
});

app.put("/api/drivers/:id", (req, res) => {
  const errors = validateDriver(req.body);
  if (respondValidation(res, errors)) return;
  const stmt = db.prepare(`
    UPDATE drivers SET
      name = ?,
      nationality = ?,
      birthdate = ?,
      profile_image_url = ?,
      championships = ?,
      wins = ?,
      podiums = ?,
      poles = ?,
      fastest_laps = ?,
      biography = ?
    WHERE id = ?
  `);
  stmt.run(
    req.body.name,
    req.body.nationality || "",
    req.body.birthdate || "",
    req.body.profile_image_url || "",
    toIntOrNull(req.body.championships) ?? 0,
    toIntOrNull(req.body.wins) ?? 0,
    toIntOrNull(req.body.podiums) ?? 0,
    toIntOrNull(req.body.poles) ?? 0,
    toIntOrNull(req.body.fastest_laps) ?? 0,
    req.body.biography || "",
    req.params.id
  );
  setDriverTeams(req.params.id, req.body.team_ids || []);
  res.json(getById("drivers", req.params.id));
});

app.delete("/api/drivers/:id", (req, res) => {
  removeById("drivers", req.params.id);
  res.json({ ok: true });
});

// Teams
app.get("/api/teams", (req, res) => {
  res.json(list("teams"));
});

app.get("/api/teams/:id", (req, res) => {
  const row = getById("teams", req.params.id);
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(row);
});

app.post("/api/teams", (req, res) => {
  const errors = validateTeam(req.body);
  if (respondValidation(res, errors)) return;
  const stmt = db.prepare(`
    INSERT INTO teams (team_name, logo_url, base_country, championships, active_years)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    req.body.team_name,
    req.body.logo_url || "",
    req.body.base_country || "",
    toIntOrNull(req.body.championships) ?? 0,
    req.body.active_years || ""
  );
  res.json(getById("teams", info.lastInsertRowid));
});

app.put("/api/teams/:id", (req, res) => {
  const errors = validateTeam(req.body);
  if (respondValidation(res, errors)) return;
  const stmt = db.prepare(`
    UPDATE teams SET
      team_name = ?,
      logo_url = ?,
      base_country = ?,
      championships = ?,
      active_years = ?
    WHERE id = ?
  `);
  stmt.run(
    req.body.team_name,
    req.body.logo_url || "",
    req.body.base_country || "",
    toIntOrNull(req.body.championships) ?? 0,
    req.body.active_years || "",
    req.params.id
  );
  res.json(getById("teams", req.params.id));
});

app.delete("/api/teams/:id", (req, res) => {
  removeById("teams", req.params.id);
  res.json({ ok: true });
});

// Circuits
app.get("/api/circuits", (req, res) => {
  res.json(list("circuits"));
});

app.get("/api/circuits/:id", (req, res) => {
  const row = getById("circuits", req.params.id);
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(row);
});

app.post("/api/circuits", (req, res) => {
  const errors = validateCircuit(req.body);
  if (respondValidation(res, errors)) return;
  const stmt = db.prepare(`
    INSERT INTO circuits (circuit_name, country, track_layout_url, lap_length_km, first_gp_year)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    req.body.circuit_name,
    req.body.country || "",
    req.body.track_layout_url || "",
    toFloatOrNull(req.body.lap_length_km),
    toIntOrNull(req.body.first_gp_year)
  );
  res.json(getById("circuits", info.lastInsertRowid));
});

app.put("/api/circuits/:id", (req, res) => {
  const errors = validateCircuit(req.body);
  if (respondValidation(res, errors)) return;
  const stmt = db.prepare(`
    UPDATE circuits SET
      circuit_name = ?,
      country = ?,
      track_layout_url = ?,
      lap_length_km = ?,
      first_gp_year = ?
    WHERE id = ?
  `);
  stmt.run(
    req.body.circuit_name,
    req.body.country || "",
    req.body.track_layout_url || "",
    toFloatOrNull(req.body.lap_length_km),
    toIntOrNull(req.body.first_gp_year),
    req.params.id
  );
  res.json(getById("circuits", req.params.id));
});

app.delete("/api/circuits/:id", (req, res) => {
  removeById("circuits", req.params.id);
  res.json({ ok: true });
});

// Seasons
app.get("/api/seasons", (req, res) => {
  res.json(list("seasons"));
});

app.get("/api/seasons/:id", (req, res) => {
  const row = getById("seasons", req.params.id);
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(row);
});

app.post("/api/seasons", (req, res) => {
  const errors = validateSeason(req.body);
  if (respondValidation(res, errors)) return;
  const stmt = db.prepare(`
    INSERT INTO seasons (year, champion_driver_id, champion_team_id, total_races, banner_image_url)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    toIntOrNull(req.body.year),
    toIntOrNull(req.body.champion_driver_id),
    toIntOrNull(req.body.champion_team_id),
    toIntOrNull(req.body.total_races) ?? 0,
    req.body.banner_image_url || ""
  );
  res.json(getById("seasons", info.lastInsertRowid));
});

app.put("/api/seasons/:id", (req, res) => {
  const errors = validateSeason(req.body);
  if (respondValidation(res, errors)) return;
  const stmt = db.prepare(`
    UPDATE seasons SET
      year = ?,
      champion_driver_id = ?,
      champion_team_id = ?,
      total_races = ?,
      banner_image_url = ?
    WHERE id = ?
  `);
  stmt.run(
    toIntOrNull(req.body.year),
    toIntOrNull(req.body.champion_driver_id),
    toIntOrNull(req.body.champion_team_id),
    toIntOrNull(req.body.total_races) ?? 0,
    req.body.banner_image_url || "",
    req.params.id
  );
  res.json(getById("seasons", req.params.id));
});

app.delete("/api/seasons/:id", (req, res) => {
  removeById("seasons", req.params.id);
  res.json({ ok: true });
});

// Races
app.get("/api/races", (req, res) => {
  res.json(list("races"));
});

app.get("/api/races/:id", (req, res) => {
  const row = getById("races", req.params.id);
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(row);
});

app.post("/api/races", (req, res) => {
  const errors = validateRace(req.body);
  if (respondValidation(res, errors)) return;
  const stmt = db.prepare(`
    INSERT INTO races (season_id, circuit_id, winner_driver_id, second_driver_id, third_driver_id, fastest_lap_driver_id, laps)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    toIntOrNull(req.body.season_id),
    toIntOrNull(req.body.circuit_id),
    toIntOrNull(req.body.winner_driver_id),
    toIntOrNull(req.body.second_driver_id),
    toIntOrNull(req.body.third_driver_id),
    toIntOrNull(req.body.fastest_lap_driver_id),
    toIntOrNull(req.body.laps)
  );
  res.json(getById("races", info.lastInsertRowid));
});

app.put("/api/races/:id", (req, res) => {
  const errors = validateRace(req.body);
  if (respondValidation(res, errors)) return;
  const stmt = db.prepare(`
    UPDATE races SET
      season_id = ?,
      circuit_id = ?,
      winner_driver_id = ?,
      second_driver_id = ?,
      third_driver_id = ?,
      fastest_lap_driver_id = ?,
      laps = ?
    WHERE id = ?
  `);
  stmt.run(
    toIntOrNull(req.body.season_id),
    toIntOrNull(req.body.circuit_id),
    toIntOrNull(req.body.winner_driver_id),
    toIntOrNull(req.body.second_driver_id),
    toIntOrNull(req.body.third_driver_id),
    toIntOrNull(req.body.fastest_lap_driver_id),
    toIntOrNull(req.body.laps),
    req.params.id
  );
  res.json(getById("races", req.params.id));
});

app.delete("/api/races/:id", (req, res) => {
  removeById("races", req.params.id);
  res.json({ ok: true });
});

// Media
app.get("/api/media", (req, res) => {
  res.json(list("media"));
});

app.get("/api/media/:id", (req, res) => {
  const row = getById("media", req.params.id);
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(row);
});

app.post("/api/media", (req, res) => {
  const errors = validateMedia(req.body);
  if (respondValidation(res, errors)) return;
  const stmt = db.prepare(`
    INSERT INTO media (title, url, category, caption)
    VALUES (?, ?, ?, ?)
  `);
  const info = stmt.run(
    req.body.title,
    req.body.url,
    req.body.category || "",
    req.body.caption || ""
  );
  res.json(getById("media", info.lastInsertRowid));
});

app.put("/api/media/:id", (req, res) => {
  const errors = validateMedia(req.body);
  if (respondValidation(res, errors)) return;
  const stmt = db.prepare(`
    UPDATE media SET
      title = ?,
      url = ?,
      category = ?,
      caption = ?
    WHERE id = ?
  `);
  stmt.run(
    req.body.title,
    req.body.url,
    req.body.category || "",
    req.body.caption || "",
    req.params.id
  );
  res.json(getById("media", req.params.id));
});

app.delete("/api/media/:id", (req, res) => {
  removeById("media", req.params.id);
  res.json({ ok: true });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`F1 Historical CMS running at http://localhost:${port}`);
});
