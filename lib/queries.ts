import type {
  Circuit,
  ConstructorStanding,
  Driver,
  DriverStanding,
  Media,
  Race,
  RaceResultPosition,
  Season,
  Team,
  TimelineEvent,
} from "../types";
import { createSupabaseAdmin } from "./supabase/server";

const supabase = createSupabaseAdmin();

function ensureNoError<T>(result: { data: T; error: any }) {
  if (result.error) throw result.error;
  return result.data;
}

async function readWithFallback<T>(label: string, readFn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await readFn();
  } catch (error) {
    const details =
      error && typeof error === "object"
        ? JSON.stringify(
            {
              message: (error as { message?: string }).message,
              code: (error as { code?: string }).code,
              hint: (error as { hint?: string }).hint,
              details: (error as { details?: string }).details,
            },
            null,
            0
          )
        : String(error);
    console.warn(`[readWithFallback] ${label} -> using fallback`, details);
    return fallback;
  }
}

export async function listTeams(): Promise<Team[]> {
  return readWithFallback("listTeams", async () => {
    const result = await supabase.from("teams").select("*").or("status.eq.published,status.is.null").order("team_name");
    return ensureNoError(result) as Team[];
  }, []);
}

export async function getTeam(id: number): Promise<Team | null> {
  return readWithFallback("getTeam", async () => {
    const result = await supabase.from("teams").select("*").eq("id", id).single();
    return result.error ? null : (result.data as Team);
  }, null);
}

export async function createTeam(data: Omit<Team, "id">) {
  const result = await supabase.from("teams").insert(data).select("*").single();
  return ensureNoError(result) as Team;
}

export async function updateTeam(id: number, data: Omit<Team, "id">) {
  const result = await supabase.from("teams").update(data).eq("id", id).select("*").single();
  return ensureNoError(result) as Team;
}

export async function deleteTeam(id: number) {
  const result = await supabase.from("teams").delete().eq("id", id);
  return ensureNoError(result);
}

export async function listDrivers(): Promise<Driver[]> {
  return readWithFallback("listDrivers", async () => {
    const driversResult = await supabase.from("drivers").select("*").or("status.eq.published,status.is.null").order("name");
    const drivers = ensureNoError(driversResult) as Driver[];
    const linksResult = await supabase.from("driver_teams").select("driver_id, team_id");
    const links = ensureNoError(linksResult) as { driver_id: number; team_id: number }[];
    const map = new Map<number, number[]>();
    links.forEach((link) => {
      if (!map.has(link.driver_id)) map.set(link.driver_id, []);
      map.get(link.driver_id)?.push(link.team_id);
    });
    return drivers.map((driver) => ({ ...driver, team_ids: map.get(driver.id) ?? [] }));
  }, []);
}

export async function getDriver(id: number): Promise<Driver | null> {
  return readWithFallback("getDriver", async () => {
    const driverResult = await supabase.from("drivers").select("*").eq("id", id).single();
    if (driverResult.error) return null;
    const linksResult = await supabase.from("driver_teams").select("team_id").eq("driver_id", id);
    const links = ensureNoError(linksResult) as { team_id: number }[];
    return { ...(driverResult.data as Driver), team_ids: links.map((link) => link.team_id) };
  }, null);
}

export async function createDriver(data: Omit<Driver, "id">) {
  const { team_ids, ...driverData } = data;
  const result = await supabase.from("drivers").insert(driverData).select("*").single();
  const driver = ensureNoError(result) as Driver;
  await setDriverTeams(driver.id, team_ids ?? []);
  return getDriver(driver.id);
}

export async function updateDriver(id: number, data: Omit<Driver, "id">) {
  const { team_ids, ...driverData } = data;
  const result = await supabase.from("drivers").update(driverData).eq("id", id).select("*").single();
  ensureNoError(result);
  await setDriverTeams(id, team_ids ?? []);
  return getDriver(id);
}

export async function deleteDriver(id: number) {
  const result = await supabase.from("drivers").delete().eq("id", id);
  return ensureNoError(result);
}

async function setDriverTeams(driverId: number, teamIds: number[]) {
  await supabase.from("driver_teams").delete().eq("driver_id", driverId);
  if (!teamIds.length) return;
  const payload = teamIds.map((teamId) => ({ driver_id: driverId, team_id: teamId }));
  await supabase.from("driver_teams").insert(payload);
}

export async function listCircuits(): Promise<Circuit[]> {
  return readWithFallback("listCircuits", async () => {
    const result = await supabase.from("circuits").select("*").or("status.eq.published,status.is.null").order("circuit_name");
    return ensureNoError(result) as Circuit[];
  }, []);
}

export async function getCircuit(id: number): Promise<Circuit | null> {
  return readWithFallback("getCircuit", async () => {
    const result = await supabase.from("circuits").select("*").eq("id", id).single();
    return result.error ? null : (result.data as Circuit);
  }, null);
}

export async function createCircuit(data: Omit<Circuit, "id">) {
  const result = await supabase.from("circuits").insert(data).select("*").single();
  return ensureNoError(result) as Circuit;
}

export async function updateCircuit(id: number, data: Omit<Circuit, "id">) {
  const result = await supabase.from("circuits").update(data).eq("id", id).select("*").single();
  return ensureNoError(result) as Circuit;
}

export async function deleteCircuit(id: number) {
  const result = await supabase.from("circuits").delete().eq("id", id);
  return ensureNoError(result);
}

export async function listSeasons(): Promise<Season[]> {
  return readWithFallback("listSeasons", async () => {
    const result = await supabase.from("seasons").select("*").or("status.eq.published,status.is.null").order("year", { ascending: false });
    return ensureNoError(result) as Season[];
  }, []);
}

export async function getSeason(id: number): Promise<Season | null> {
  return readWithFallback("getSeason", async () => {
    const result = await supabase.from("seasons").select("*").eq("id", id).single();
    return result.error ? null : (result.data as Season);
  }, null);
}

export async function getSeasonByYear(year: number): Promise<Season | null> {
  return readWithFallback("getSeasonByYear", async () => {
    const result = await supabase.from("seasons").select("*").eq("year", year).single();
    return result.error ? null : (result.data as Season);
  }, null);
}

export async function createSeason(data: Omit<Season, "id">) {
  const result = await supabase.from("seasons").insert(data).select("*").single();
  return ensureNoError(result) as Season;
}

export async function updateSeason(id: number, data: Omit<Season, "id">) {
  const result = await supabase.from("seasons").update(data).eq("id", id).select("*").single();
  return ensureNoError(result) as Season;
}

export async function deleteSeason(id: number) {
  const result = await supabase.from("seasons").delete().eq("id", id);
  return ensureNoError(result);
}

export async function listRaces(): Promise<Race[]> {
  return readWithFallback("listRaces", async () => {
    const result = await supabase.from("races").select("*").order("id", { ascending: false });
    return ensureNoError(result) as Race[];
  }, []);
}

export async function getRace(id: number): Promise<Race | null> {
  return readWithFallback("getRace", async () => {
    const result = await supabase.from("races").select("*").eq("id", id).single();
    if (result.error) return null;
    const positions = await listRaceResultPositionsByRace(id);
    return { ...(result.data as Race), results_positions: positions.map(({ id: _id, race_id, ...rest }) => rest) };
  }, null);
}

export async function createRace(data: Omit<Race, "id">) {
  const { results_positions, ...raceData } = data;
  const normalized = normalizeRacePodium(raceData, results_positions);
  const result = await supabase.from("races").insert(normalized).select("*").single();
  const race = ensureNoError(result) as Race;
  await setRaceResultPositions(race.id, results_positions ?? []);
  return getRace(race.id);
}

export async function updateRace(id: number, data: Omit<Race, "id">) {
  const { results_positions, ...raceData } = data;
  const normalized = normalizeRacePodium(raceData, results_positions);
  const result = await supabase.from("races").update(normalized).eq("id", id).select("*").single();
  ensureNoError(result);
  await setRaceResultPositions(id, results_positions ?? []);
  return getRace(id);
}

export async function deleteRace(id: number) {
  const result = await supabase.from("races").delete().eq("id", id);
  return ensureNoError(result);
}

function normalizeRacePodium(raceData: Omit<Race, "id" | "results_positions">, results?: Omit<RaceResultPosition, "id" | "race_id">[]) {
  if (!results || !results.length) return raceData;
  const sorted = [...results].sort((a, b) => a.position - b.position);
  return {
    ...raceData,
    winner_driver_id: sorted.find((item) => item.position === 1)?.driver_id ?? raceData.winner_driver_id ?? null,
    second_driver_id: sorted.find((item) => item.position === 2)?.driver_id ?? raceData.second_driver_id ?? null,
    third_driver_id: sorted.find((item) => item.position === 3)?.driver_id ?? raceData.third_driver_id ?? null,
  };
}

async function setRaceResultPositions(raceId: number, rows: Omit<RaceResultPosition, "id" | "race_id">[]) {
  await supabase.from("race_results_positions").delete().eq("race_id", raceId);
  if (!rows.length) return;
  const payload = rows
    .filter((row) => row.driver_id && row.position)
    .sort((a, b) => a.position - b.position)
    .map((row) => ({
      race_id: raceId,
      driver_id: row.driver_id,
      team_id: row.team_id ?? null,
      position: row.position,
      points: row.points,
      laps: row.laps ?? null,
      time: row.time ?? null,
      status: row.status,
    }));
  if (!payload.length) return;
  const insertResult = await supabase.from("race_results_positions").insert(payload);
  ensureNoError(insertResult);
}

export async function listRaceResultPositions(): Promise<RaceResultPosition[]> {
  return readWithFallback("listRaceResultPositions", async () => {
    const result = await supabase.from("race_results_positions").select("*").order("position", { ascending: true });
    return ensureNoError(result) as RaceResultPosition[];
  }, []);
}

export async function listRaceResultPositionsByRace(raceId: number): Promise<RaceResultPosition[]> {
  return readWithFallback("listRaceResultPositionsByRace", async () => {
    const result = await supabase
      .from("race_results_positions")
      .select("*")
      .eq("race_id", raceId)
      .order("position", { ascending: true });
    return ensureNoError(result) as RaceResultPosition[];
  }, []);
}

export async function listMedia(): Promise<Media[]> {
  return readWithFallback("listMedia", async () => {
    const result = await supabase.from("media").select("*").order("id", { ascending: false });
    return ensureNoError(result) as Media[];
  }, []);
}

export async function getMedia(id: number): Promise<Media | null> {
  return readWithFallback("getMedia", async () => {
    const result = await supabase.from("media").select("*").eq("id", id).single();
    return result.error ? null : (result.data as Media);
  }, null);
}

export async function createMedia(data: Omit<Media, "id">) {
  const result = await supabase.from("media").insert(data).select("*").single();
  return ensureNoError(result) as Media;
}

export async function updateMedia(id: number, data: Omit<Media, "id">) {
  const result = await supabase.from("media").update(data).eq("id", id).select("*").single();
  return ensureNoError(result) as Media;
}

export async function deleteMedia(id: number) {
  const result = await supabase.from("media").delete().eq("id", id);
  return ensureNoError(result);
}

export async function listDriverStandings(): Promise<DriverStanding[]> {
  return readWithFallback("listDriverStandings", async () => {
    const result = await supabase.from("driver_standings").select("*").order("position");
    return ensureNoError(result) as DriverStanding[];
  }, []);
}

export async function listDriverStandingsBySeason(seasonId: number): Promise<DriverStanding[]> {
  return readWithFallback("listDriverStandingsBySeason", async () => {
    const result = await supabase
      .from("driver_standings")
      .select("*")
      .eq("season_id", seasonId)
      .order("position", { ascending: true });
    return ensureNoError(result) as DriverStanding[];
  }, []);
}

export async function getDriverStanding(id: number): Promise<DriverStanding | null> {
  return readWithFallback("getDriverStanding", async () => {
    const result = await supabase.from("driver_standings").select("*").eq("id", id).single();
    return result.error ? null : (result.data as DriverStanding);
  }, null);
}

export async function createDriverStanding(data: Omit<DriverStanding, "id">) {
  const result = await supabase.from("driver_standings").insert(data).select("*").single();
  return ensureNoError(result) as DriverStanding;
}

export async function updateDriverStanding(id: number, data: Omit<DriverStanding, "id">) {
  const result = await supabase.from("driver_standings").update(data).eq("id", id).select("*").single();
  return ensureNoError(result) as DriverStanding;
}

export async function deleteDriverStanding(id: number) {
  const result = await supabase.from("driver_standings").delete().eq("id", id);
  return ensureNoError(result);
}

export async function listConstructorStandings(): Promise<ConstructorStanding[]> {
  return readWithFallback("listConstructorStandings", async () => {
    const result = await supabase.from("constructor_standings").select("*").order("position");
    return ensureNoError(result) as ConstructorStanding[];
  }, []);
}

export async function listConstructorStandingsBySeason(seasonId: number): Promise<ConstructorStanding[]> {
  return readWithFallback("listConstructorStandingsBySeason", async () => {
    const result = await supabase
      .from("constructor_standings")
      .select("*")
      .eq("season_id", seasonId)
      .order("position", { ascending: true });
    return ensureNoError(result) as ConstructorStanding[];
  }, []);
}

export async function getConstructorStanding(id: number): Promise<ConstructorStanding | null> {
  return readWithFallback("getConstructorStanding", async () => {
    const result = await supabase.from("constructor_standings").select("*").eq("id", id).single();
    return result.error ? null : (result.data as ConstructorStanding);
  }, null);
}

export async function createConstructorStanding(data: Omit<ConstructorStanding, "id">) {
  const result = await supabase.from("constructor_standings").insert(data).select("*").single();
  return ensureNoError(result) as ConstructorStanding;
}

export async function updateConstructorStanding(id: number, data: Omit<ConstructorStanding, "id">) {
  const result = await supabase.from("constructor_standings").update(data).eq("id", id).select("*").single();
  return ensureNoError(result) as ConstructorStanding;
}

export async function deleteConstructorStanding(id: number) {
  const result = await supabase.from("constructor_standings").delete().eq("id", id);
  return ensureNoError(result);
}

export async function listTimelineEvents(): Promise<TimelineEvent[]> {
  return readWithFallback("listTimelineEvents", async () => {
    const result = await supabase.from("timeline_events").select("*").order("year", { ascending: true });
    return ensureNoError(result) as TimelineEvent[];
  }, []);
}

export async function getTimelineEvent(id: number): Promise<TimelineEvent | null> {
  return readWithFallback("getTimelineEvent", async () => {
    const result = await supabase.from("timeline_events").select("*").eq("id", id).single();
    return result.error ? null : (result.data as TimelineEvent);
  }, null);
}

export async function createTimelineEvent(data: Omit<TimelineEvent, "id">) {
  const result = await supabase.from("timeline_events").insert(data).select("*").single();
  return ensureNoError(result) as TimelineEvent;
}

export async function updateTimelineEvent(id: number, data: Omit<TimelineEvent, "id">) {
  const result = await supabase.from("timeline_events").update(data).eq("id", id).select("*").single();
  return ensureNoError(result) as TimelineEvent;
}

export async function deleteTimelineEvent(id: number) {
  const result = await supabase.from("timeline_events").delete().eq("id", id);
  return ensureNoError(result);
}


// Admin queries (include drafts)
export async function listTeamsAdmin(): Promise<Team[]> {
  return readWithFallback("listTeamsAdmin", async () => {
    const result = await supabase.from("teams").select("*").order("team_name");
    return ensureNoError(result) as Team[];
  }, []);
}

export async function listDriversAdmin(): Promise<Driver[]> {
  return readWithFallback("listDriversAdmin", async () => {
    const driversResult = await supabase.from("drivers").select("*").order("name");
    const drivers = ensureNoError(driversResult) as Driver[];
    const linksResult = await supabase.from("driver_teams").select("driver_id, team_id");
    const links = ensureNoError(linksResult) as { driver_id: number; team_id: number }[];
    const map = new Map<number, number[]>();
    links.forEach((link) => {
      if (!map.has(link.driver_id)) map.set(link.driver_id, []);
      map.get(link.driver_id)?.push(link.team_id);
    });
    return drivers.map((driver) => ({ ...driver, team_ids: map.get(driver.id) ?? [] }));
  }, []);
}

export async function listCircuitsAdmin(): Promise<Circuit[]> {
  return readWithFallback("listCircuitsAdmin", async () => {
    const result = await supabase.from("circuits").select("*").order("circuit_name");
    return ensureNoError(result) as Circuit[];
  }, []);
}

export async function listSeasonsAdmin(): Promise<Season[]> {
  return readWithFallback("listSeasonsAdmin", async () => {
    const result = await supabase.from("seasons").select("*").order("year", { ascending: false });
    return ensureNoError(result) as Season[];
  }, []);
}
