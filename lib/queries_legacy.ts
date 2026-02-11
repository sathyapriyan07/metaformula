import db from "./db";
import type { Circuit, Driver, Media, Race, Season, Team } from "../types";

export function listTeams(): Team[] {
  return db.prepare("SELECT * FROM teams ORDER BY team_name").all() as Team[];
}

export function getTeam(id: number): Team | undefined {
  return db.prepare("SELECT * FROM teams WHERE id = ?").get(id) as Team | undefined;
}

export function createTeam(data: Omit<Team, "id">) {
  const stmt = db.prepare(
    `INSERT INTO teams (team_name, logo_url, base_country, championships, active_years) VALUES (?, ?, ?, ?, ?)`
  );
  const info = stmt.run(
    data.team_name,
    data.logo_url ?? "",
    data.base_country ?? "",
    data.championships ?? 0,
    data.active_years ?? ""
  );
  return getTeam(Number(info.lastInsertRowid));
}

export function updateTeam(id: number, data: Omit<Team, "id">) {
  const stmt = db.prepare(
    `UPDATE teams SET team_name = ?, logo_url = ?, base_country = ?, championships = ?, active_years = ? WHERE id = ?`
  );
  stmt.run(
    data.team_name,
    data.logo_url ?? "",
    data.base_country ?? "",
    data.championships ?? 0,
    data.active_years ?? "",
    id
  );
  return getTeam(id);
}

export function deleteTeam(id: number) {
  return db.prepare("DELETE FROM teams WHERE id = ?").run(id);
}

export function listDrivers(): Driver[] {
  const drivers = db.prepare("SELECT * FROM drivers ORDER BY name").all() as Driver[];
  const links = db.prepare("SELECT * FROM driver_teams").all() as { driver_id: number; team_id: number }[];
  const map = new Map<number, number[]>();
  links.forEach((link) => {
    if (!map.has(link.driver_id)) map.set(link.driver_id, []);
    map.get(link.driver_id)?.push(link.team_id);
  });
  return drivers.map((driver) => ({ ...driver, team_ids: map.get(driver.id) ?? [] }));
}

export function getDriver(id: number): Driver | undefined {
  const driver = db.prepare("SELECT * FROM drivers WHERE id = ?").get(id) as Driver | undefined;
  if (!driver) return undefined;
  const teamIds = db
    .prepare("SELECT team_id FROM driver_teams WHERE driver_id = ?")
    .all(id)
    .map((row: { team_id: number }) => row.team_id);
  return { ...driver, team_ids: teamIds };
}

export function createDriver(data: Omit<Driver, "id">) {
  const stmt = db.prepare(
    `INSERT INTO drivers (name, nationality, birthdate, profile_image_url, championships, wins, podiums, poles, fastest_laps, biography)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const info = stmt.run(
    data.name,
    data.nationality ?? "",
    data.birthdate ?? "",
    data.profile_image_url ?? "",
    data.championships ?? 0,
    data.wins ?? 0,
    data.podiums ?? 0,
    data.poles ?? 0,
    data.fastest_laps ?? 0,
    data.biography ?? ""
  );
  const id = Number(info.lastInsertRowid);
  setDriverTeams(id, data.team_ids ?? []);
  return getDriver(id);
}

export function updateDriver(id: number, data: Omit<Driver, "id">) {
  const stmt = db.prepare(
    `UPDATE drivers SET name = ?, nationality = ?, birthdate = ?, profile_image_url = ?, championships = ?, wins = ?, podiums = ?, poles = ?, fastest_laps = ?, biography = ? WHERE id = ?`
  );
  stmt.run(
    data.name,
    data.nationality ?? "",
    data.birthdate ?? "",
    data.profile_image_url ?? "",
    data.championships ?? 0,
    data.wins ?? 0,
    data.podiums ?? 0,
    data.poles ?? 0,
    data.fastest_laps ?? 0,
    data.biography ?? "",
    id
  );
  setDriverTeams(id, data.team_ids ?? []);
  return getDriver(id);
}

export function deleteDriver(id: number) {
  return db.prepare("DELETE FROM drivers WHERE id = ?").run(id);
}

function setDriverTeams(driverId: number, teamIds: number[]) {
  db.prepare("DELETE FROM driver_teams WHERE driver_id = ?").run(driverId);
  const insert = db.prepare("INSERT INTO driver_teams (driver_id, team_id) VALUES (?, ?)");
  const tx = db.transaction((ids: number[]) => {
    ids.filter(Boolean).forEach((teamId) => insert.run(driverId, teamId));
  });
  tx(teamIds);
}

export function listCircuits(): Circuit[] {
  return db.prepare("SELECT * FROM circuits ORDER BY circuit_name").all() as Circuit[];
}

export function getCircuit(id: number): Circuit | undefined {
  return db.prepare("SELECT * FROM circuits WHERE id = ?").get(id) as Circuit | undefined;
}

export function createCircuit(data: Omit<Circuit, "id">) {
  const stmt = db.prepare(
    `INSERT INTO circuits (circuit_name, country, track_layout_url, lap_length_km, first_gp_year)
     VALUES (?, ?, ?, ?, ?)`
  );
  const info = stmt.run(
    data.circuit_name,
    data.country ?? "",
    data.track_layout_url ?? "",
    data.lap_length_km ?? null,
    data.first_gp_year ?? null
  );
  return getCircuit(Number(info.lastInsertRowid));
}

export function updateCircuit(id: number, data: Omit<Circuit, "id">) {
  const stmt = db.prepare(
    `UPDATE circuits SET circuit_name = ?, country = ?, track_layout_url = ?, lap_length_km = ?, first_gp_year = ? WHERE id = ?`
  );
  stmt.run(
    data.circuit_name,
    data.country ?? "",
    data.track_layout_url ?? "",
    data.lap_length_km ?? null,
    data.first_gp_year ?? null,
    id
  );
  return getCircuit(id);
}

export function deleteCircuit(id: number) {
  return db.prepare("DELETE FROM circuits WHERE id = ?").run(id);
}

export function listSeasons(): Season[] {
  return db.prepare("SELECT * FROM seasons ORDER BY year DESC").all() as Season[];
}

export function getSeason(id: number): Season | undefined {
  return db.prepare("SELECT * FROM seasons WHERE id = ?").get(id) as Season | undefined;
}

export function createSeason(data: Omit<Season, "id">) {
  const stmt = db.prepare(
    `INSERT INTO seasons (year, champion_driver_id, champion_team_id, total_races, banner_image_url)
     VALUES (?, ?, ?, ?, ?)`
  );
  const info = stmt.run(
    data.year,
    data.champion_driver_id ?? null,
    data.champion_team_id ?? null,
    data.total_races ?? 0,
    data.banner_image_url ?? ""
  );
  return getSeason(Number(info.lastInsertRowid));
}

export function updateSeason(id: number, data: Omit<Season, "id">) {
  const stmt = db.prepare(
    `UPDATE seasons SET year = ?, champion_driver_id = ?, champion_team_id = ?, total_races = ?, banner_image_url = ? WHERE id = ?`
  );
  stmt.run(
    data.year,
    data.champion_driver_id ?? null,
    data.champion_team_id ?? null,
    data.total_races ?? 0,
    data.banner_image_url ?? "",
    id
  );
  return getSeason(id);
}

export function deleteSeason(id: number) {
  return db.prepare("DELETE FROM seasons WHERE id = ?").run(id);
}

export function listRaces(): Race[] {
  return db.prepare("SELECT * FROM races ORDER BY id DESC").all() as Race[];
}

export function getRace(id: number): Race | undefined {
  return db.prepare("SELECT * FROM races WHERE id = ?").get(id) as Race | undefined;
}

export function createRace(data: Omit<Race, "id">) {
  const stmt = db.prepare(
    `INSERT INTO races (season_id, circuit_id, winner_driver_id, second_driver_id, third_driver_id, fastest_lap_driver_id, laps)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );
  const info = stmt.run(
    data.season_id,
    data.circuit_id,
    data.winner_driver_id ?? null,
    data.second_driver_id ?? null,
    data.third_driver_id ?? null,
    data.fastest_lap_driver_id ?? null,
    data.laps ?? null
  );
  return getRace(Number(info.lastInsertRowid));
}

export function updateRace(id: number, data: Omit<Race, "id">) {
  const stmt = db.prepare(
    `UPDATE races SET season_id = ?, circuit_id = ?, winner_driver_id = ?, second_driver_id = ?, third_driver_id = ?, fastest_lap_driver_id = ?, laps = ? WHERE id = ?`
  );
  stmt.run(
    data.season_id,
    data.circuit_id,
    data.winner_driver_id ?? null,
    data.second_driver_id ?? null,
    data.third_driver_id ?? null,
    data.fastest_lap_driver_id ?? null,
    data.laps ?? null,
    id
  );
  return getRace(id);
}

export function deleteRace(id: number) {
  return db.prepare("DELETE FROM races WHERE id = ?").run(id);
}

export function listMedia(): Media[] {
  return db.prepare("SELECT * FROM media ORDER BY id DESC").all() as Media[];
}

export function getMedia(id: number): Media | undefined {
  return db.prepare("SELECT * FROM media WHERE id = ?").get(id) as Media | undefined;
}

export function createMedia(data: Omit<Media, "id">) {
  const stmt = db.prepare(`INSERT INTO media (title, url, category, caption) VALUES (?, ?, ?, ?)`);
  const info = stmt.run(data.title, data.url, data.category ?? "", data.caption ?? "");
  return getMedia(Number(info.lastInsertRowid));
}

export function updateMedia(id: number, data: Omit<Media, "id">) {
  const stmt = db.prepare(`UPDATE media SET title = ?, url = ?, category = ?, caption = ? WHERE id = ?`);
  stmt.run(data.title, data.url, data.category ?? "", data.caption ?? "", id);
  return getMedia(id);
}

export function deleteMedia(id: number) {
  return db.prepare("DELETE FROM media WHERE id = ?").run(id);
}
