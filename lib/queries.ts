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
    const payload =
      error && typeof error === "object"
        ? {
            message: (error as { message?: string }).message,
            code: (error as { code?: string }).code,
            hint: (error as { hint?: string }).hint,
            details: (error as { details?: string }).details,
          }
        : { message: String(error) };

    const summarized = JSON.stringify(payload);
    const compact = summarized
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .slice(0, 280);

    console.warn(`[readWithFallback] ${label} -> using fallback`, compact);
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

export interface SeasonStatistics {
  totalRaces: number;
  uniqueWinners: number;
  mostWinsDriver: { id: number; name: string; wins: number } | null;
  mostPodiums: { id: number; name: string; podiums: number } | null;
  totalLaps: number;
}

export async function getSeasonStatistics(seasonId: number): Promise<SeasonStatistics> {
  return readWithFallback("getSeasonStatistics", async () => {
    // Try to use cached stats first (if season_stats table exists)
    const cachedResult = await supabase
      .from("season_stats")
      .select(`
        total_races,
        unique_winners,
        most_wins_driver_id,
        most_wins_count,
        most_podiums_driver_id,
        most_podiums_count,
        total_laps,
        most_wins_driver:drivers!most_wins_driver_id(id, name),
        most_podiums_driver:drivers!most_podiums_driver_id(id, name)
      `)
      .eq("season_id", seasonId)
      .single();

    if (!cachedResult.error && cachedResult.data) {
      const data = cachedResult.data as any;
      return {
        totalRaces: data.total_races,
        uniqueWinners: data.unique_winners,
        mostWinsDriver: data.most_wins_driver ? {
          id: data.most_wins_driver.id,
          name: data.most_wins_driver.name,
          wins: data.most_wins_count,
        } : null,
        mostPodiums: data.most_podiums_driver ? {
          id: data.most_podiums_driver.id,
          name: data.most_podiums_driver.name,
          podiums: data.most_podiums_count,
        } : null,
        totalLaps: data.total_laps,
      };
    }

    // Fallback: Calculate on-the-fly if cached table doesn't exist
    // Total races
    const racesResult = await supabase
      .from("races")
      .select("id, laps", { count: "exact" })
      .eq("season_id", seasonId);
    const races = ensureNoError(racesResult) as any[];
    const totalRaces = races?.length ?? 0;
    const totalLaps = races?.reduce((sum, race) => sum + (race.laps ?? 0), 0) ?? 0;

    // Get all race results for this season
    const resultsResult = await supabase
      .from("race_results_positions")
      .select(`
        driver_id,
        position,
        races!inner(season_id)
      `)
      .eq("races.season_id", seasonId);
    const results = ensureNoError(resultsResult) as any[];

    // Calculate winners and podiums
    const winnerSet = new Set<number>();
    const winCounts = new Map<number, number>();
    const podiumCounts = new Map<number, number>();

    results.forEach((result) => {
      const driverId = result.driver_id;
      const position = result.position;

      if (position === 1) {
        winnerSet.add(driverId);
        winCounts.set(driverId, (winCounts.get(driverId) ?? 0) + 1);
      }
      if (position <= 3) {
        podiumCounts.set(driverId, (podiumCounts.get(driverId) ?? 0) + 1);
      }
    });

    // Find most wins driver
    let mostWinsDriver = null;
    if (winCounts.size > 0) {
      const [driverId, wins] = [...winCounts.entries()].sort((a, b) => b[1] - a[1])[0];
      const driverResult = await supabase.from("drivers").select("id, name").eq("id", driverId).single();
      if (!driverResult.error) {
        mostWinsDriver = { id: driverId, name: driverResult.data.name, wins };
      }
    }

    // Find most podiums driver
    let mostPodiums = null;
    if (podiumCounts.size > 0) {
      const [driverId, podiums] = [...podiumCounts.entries()].sort((a, b) => b[1] - a[1])[0];
      const driverResult = await supabase.from("drivers").select("id, name").eq("id", driverId).single();
      if (!driverResult.error) {
        mostPodiums = { id: driverId, name: driverResult.data.name, podiums };
      }
    }

    return {
      totalRaces,
      uniqueWinners: winnerSet.size,
      mostWinsDriver,
      mostPodiums,
      totalLaps,
    };
  }, {
    totalRaces: 0,
    uniqueWinners: 0,
    mostWinsDriver: null,
    mostPodiums: null,
    totalLaps: 0,
  });
}

export interface SeasonRaceRow {
  raceId: number;
  circuitId: number;
  circuitName: string;
  country: string | null;
  date: string | null;
  winnerName: string | null;
  winnerImage: string | null;
  teamName: string | null;
  teamLogo: string | null;
  laps: number | null;
  time: string | null;
}

export async function getSeasonRaceTable(seasonId: number): Promise<SeasonRaceRow[]> {
  return readWithFallback("getSeasonRaceTable", async () => {
    const racesResult = await supabase
      .from("races")
      .select(`
        id,
        circuit_id,
        laps,
        circuits!inner(circuit_name, country)
      `)
      .eq("season_id", seasonId)
      .order("id", { ascending: true });
    
    const races = ensureNoError(racesResult) as any[];
    
    const rows: SeasonRaceRow[] = [];
    
    for (const race of races) {
      // Get winner from race_results_positions
      const winnerResult = await supabase
        .from("race_results_positions")
        .select(`
          driver_id,
          laps,
          time,
          drivers!inner(name, profile_image_url, team_ids)
        `)
        .eq("race_id", race.id)
        .eq("position", 1)
        .single();
      
      let winnerName = null;
      let winnerImage = null;
      let teamName = null;
      let teamLogo = null;
      let resultLaps = race.laps;
      let resultTime = null;
      
      if (!winnerResult.error && winnerResult.data) {
        const winner = winnerResult.data as any;
        winnerName = winner.drivers?.name ?? null;
        winnerImage = winner.drivers?.profile_image_url ?? null;
        resultLaps = winner.laps ?? race.laps;
        resultTime = winner.time ?? null;
        
        // Get team info
        const teamIds = winner.drivers?.team_ids;
        if (teamIds && teamIds.length > 0) {
          const teamResult = await supabase
            .from("teams")
            .select("team_name, logo_url")
            .eq("id", teamIds[0])
            .single();
          
          if (!teamResult.error && teamResult.data) {
            teamName = teamResult.data.team_name;
            teamLogo = teamResult.data.logo_url;
          }
        }
      }
      
      rows.push({
        raceId: race.id,
        circuitId: race.circuit_id,
        circuitName: race.circuits?.circuit_name ?? "Unknown Circuit",
        country: race.circuits?.country ?? null,
        date: null, // races table doesn't have date field in schema
        winnerName,
        winnerImage,
        teamName,
        teamLogo,
        laps: resultLaps,
        time: resultTime,
      });
    }
    
    return rows;
  }, []);
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

export interface DriverSeasonStats {
  year: number;
  position: number;
  points: number;
  wins: number;
  podiums: number;
  poles: number;
}

export async function getDriverSeasonStats(driverId: number): Promise<DriverSeasonStats[]> {
  return readWithFallback("getDriverSeasonStats", async () => {
    const standingsResult = await supabase
      .from("driver_standings")
      .select(`
        position,
        points,
        wins,
        season_id,
        seasons!inner(year)
      `)
      .eq("driver_id", driverId)
      .order("seasons(year)", { ascending: false });
    
    const standings = ensureNoError(standingsResult) as any[];
    
    const resultsResult = await supabase
      .from("race_results_positions")
      .select(`
        position,
        races!inner(season_id, seasons!inner(year))
      `)
      .eq("driver_id", driverId);
    
    const results = ensureNoError(resultsResult) as any[];
    
    const seasonMap = new Map<number, { podiums: number; poles: number }>();
    results.forEach((result) => {
      const year = result.races?.seasons?.year;
      if (!year) return;
      if (!seasonMap.has(year)) seasonMap.set(year, { podiums: 0, poles: 0 });
      const stats = seasonMap.get(year)!;
      if (result.position <= 3) stats.podiums++;
      if (result.position === 1) stats.poles++;
    });
    
    return standings.map((s) => ({
      year: s.seasons.year,
      position: s.position,
      points: s.points,
      wins: s.wins,
      podiums: seasonMap.get(s.seasons.year)?.podiums ?? 0,
      poles: seasonMap.get(s.seasons.year)?.poles ?? 0,
    }));
  }, []);
}


export interface TeamDriverBySeason {
  year: number;
  drivers: {
    id: number;
    name: string;
    portrait: string | null;
    nationality: string | null;
  }[];
}

export async function getTeamDrivers(teamId: number): Promise<TeamDriverBySeason[]> {
  return readWithFallback("getTeamDrivers", async () => {
    const resultsResult = await supabase
      .from("race_results_positions")
      .select(`
        driver_id,
        drivers!inner(name, profile_image_url, nationality),
        races!inner(season_id, seasons!inner(year))
      `)
      .eq("team_id", teamId);
    
    const results = ensureNoError(resultsResult) as any[];
    
    const seasonMap = new Map<number, Set<number>>();
    const driverMap = new Map<number, any>();
    
    results.forEach((result) => {
      const year = result.races?.seasons?.year;
      const driverId = result.driver_id;
      
      if (!year || !driverId) return;
      
      if (!seasonMap.has(year)) seasonMap.set(year, new Set());
      seasonMap.get(year)!.add(driverId);
      
      if (!driverMap.has(driverId)) {
        driverMap.set(driverId, {
          id: driverId,
          name: result.drivers?.name ?? "Unknown",
          portrait: result.drivers?.profile_image_url ?? null,
          nationality: result.drivers?.nationality ?? null,
        });
      }
    });
    
    const seasons: TeamDriverBySeason[] = [];
    seasonMap.forEach((driverIds, year) => {
      seasons.push({
        year,
        drivers: Array.from(driverIds).map(id => driverMap.get(id)!),
      });
    });
    
    return seasons.sort((a, b) => b.year - a.year);
  }, []);
}

export interface TeamYearlyPerformance {
  year: number;
  position: number;
  points: number;
  wins: number;
}

export async function getTeamYearlyPerformance(teamId: number): Promise<TeamYearlyPerformance[]> {
  return readWithFallback("getTeamYearlyPerformance", async () => {
    const result = await supabase
      .from("constructor_standings")
      .select(`
        position,
        points,
        wins,
        seasons!inner(year)
      `)
      .eq("team_id", teamId)
      .order("seasons(year)", { ascending: false });
    
    const standings = ensureNoError(result) as any[];
    
    return standings.map((s) => ({
      year: s.seasons.year,
      position: s.position,
      points: s.points,
      wins: s.wins,
    }));
  }, []);
}


export interface CircuitRaceHistory {
  year: number;
  seasonId: number;
  raceName: string;
  winnerName: string | null;
  winnerImage: string | null;
  teamName: string | null;
  teamLogo: string | null;
  driverId: number | null;
  teamId: number | null;
}

export async function getCircuitHistory(circuitId: number): Promise<CircuitRaceHistory[]> {
  return readWithFallback("getCircuitHistory", async () => {
    const racesResult = await supabase
      .from("races")
      .select(`
        id,
        season_id,
        winner_driver_id,
        seasons!inner(year)
      `)
      .eq("circuit_id", circuitId)
      .order("seasons(year)", { ascending: false });
    
    const races = ensureNoError(racesResult) as any[];
    
    const raceIds = races.map(r => r.id);
    const winnersResult = await supabase
      .from("race_results_positions")
      .select(`
        race_id,
        driver_id,
        team_id,
        drivers!inner(name, profile_image_url),
        teams(team_name, logo_url)
      `)
      .in("race_id", raceIds)
      .eq("position", 1);
    
    const winners = ensureNoError(winnersResult) as any[];
    const winnerMap = new Map(winners.map(w => [w.race_id, w]));
    
    return races.map((race) => {
      const winner = winnerMap.get(race.id);
      return {
        year: race.seasons.year,
        seasonId: race.season_id,
        raceName: `Grand Prix`,
        winnerName: winner?.drivers?.name ?? null,
        winnerImage: winner?.drivers?.profile_image_url ?? null,
        teamName: winner?.teams?.team_name ?? null,
        teamLogo: winner?.teams?.logo_url ?? null,
        driverId: winner?.driver_id ?? null,
        teamId: winner?.team_id ?? null,
      };
    });
  }, []);
}

export interface CircuitRecords {
  totalRaces: number;
  fastestLap: string | null;
  fastestDriver: string | null;
  fastestDriverId: number | null;
  fastestTeam: string | null;
  fastestTeamId: number | null;
  fastestYear: number | null;
}

export async function getCircuitRecords(circuitId: number): Promise<CircuitRecords> {
  return readWithFallback("getCircuitRecords", async () => {
    const racesResult = await supabase
      .from("races")
      .select("id", { count: "exact" })
      .eq("circuit_id", circuitId);
    
    const races = ensureNoError(racesResult) as any[];
    const totalRaces = races?.length ?? 0;
    const raceIds = races?.map((r: any) => r.id) ?? [];
    
    if (raceIds.length === 0) {
      return {
        totalRaces: 0,
        fastestLap: null,
        fastestDriver: null,
        fastestDriverId: null,
        fastestTeam: null,
        fastestTeamId: null,
        fastestYear: null,
      };
    }
    
    const fastestResult = await supabase
      .from("race_results_positions")
      .select(`
        time,
        driver_id,
        team_id,
        drivers!inner(name),
        teams(team_name),
        races!inner(season_id, seasons!inner(year))
      `)
      .in("race_id", raceIds)
      .not("time", "is", null)
      .order("time", { ascending: true })
      .limit(1)
      .single();
    
    if (fastestResult.error || !fastestResult.data) {
      return {
        totalRaces,
        fastestLap: null,
        fastestDriver: null,
        fastestDriverId: null,
        fastestTeam: null,
        fastestTeamId: null,
        fastestYear: null,
      };
    }
    
    const fastest = fastestResult.data as any;
    
    return {
      totalRaces,
      fastestLap: fastest.time,
      fastestDriver: fastest.drivers?.name ?? null,
      fastestDriverId: fastest.driver_id,
      fastestTeam: fastest.teams?.team_name ?? null,
      fastestTeamId: fastest.team_id,
      fastestYear: fastest.races?.seasons?.year ?? null,
    };
  }, {
    totalRaces: 0,
    fastestLap: null,
    fastestDriver: null,
    fastestDriverId: null,
    fastestTeam: null,
    fastestTeamId: null,
    fastestYear: null,
  });
}
