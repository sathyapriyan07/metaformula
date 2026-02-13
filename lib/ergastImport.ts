async function safeFetch(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const text = await res.text();
    if (text.startsWith("<!DOCTYPE") || text.startsWith("<html")) {
      throw new Error("Provider returned HTML");
    }

    return JSON.parse(text);
  } catch (error: any) {
    clearTimeout(timeout);
    if (error.name === "AbortError") throw new Error("Request timeout");
    throw error;
  }
}

const BASE = "https://api.jolpi.ca/ergast/f1";

export async function fetchSeasons() {
  const data = await safeFetch(`${BASE}/seasons.json?limit=1000`);
  return data.MRData.SeasonTable.Seasons.map((s: any) => ({
    year: parseInt(s.season),
  }));
}

export async function fetchDrivers(year: number) {
  const data = await safeFetch(`${BASE}/${year}/drivers.json?limit=1000`);
  return data.MRData.DriverTable.Drivers.map((d: any) => ({
    slug: d.driverId,
    name: `${d.givenName} ${d.familyName}`,
    nationality: d.nationality,
    birthdate: d.dateOfBirth || null,
    number: d.permanentNumber ? parseInt(d.permanentNumber) : null,
  }));
}

export async function fetchConstructors(year: number) {
  const data = await safeFetch(`${BASE}/${year}/constructors.json?limit=1000`);
  return data.MRData.ConstructorTable.Constructors.map((c: any) => ({
    slug: c.constructorId,
    team_name: c.name,
    base_country: c.nationality,
  }));
}

export async function fetchCircuits() {
  const data = await safeFetch(`${BASE}/circuits.json?limit=1000`);
  return data.MRData.CircuitTable.Circuits.map((c: any) => ({
    slug: c.circuitId,
    name: c.circuitName,
    country: c.Location.country,
    city: c.Location.locality,
  }));
}

export async function fetchRaces(year: number) {
  const data = await safeFetch(`${BASE}/${year}.json?limit=1000`);
  return data.MRData.RaceTable.Races.map((r: any) => ({
    race_name: r.raceName,
    round: parseInt(r.round),
    circuit_slug: r.Circuit.circuitId,
    race_date: r.date,
    year,
  }));
}

export async function fetchRaceResults(year: number, round: number) {
  const data = await safeFetch(`${BASE}/${year}/${round}/results.json?limit=100`);
  const race = data?.MRData?.RaceTable?.Races?.[0];
  const results = race?.Results || [];

  return results.map((result: any) => ({
    driver_name: `${result.Driver?.givenName || ""} ${result.Driver?.familyName || ""}`.trim(),
    constructor_name: result.Constructor?.name || null,
    position: result.position ? parseInt(result.position, 10) : null,
    points: result.points ? parseFloat(result.points) : 0,
    laps: result.laps ? parseInt(result.laps, 10) : null,
    time:
      result.Time?.time ||
      result.Time?.millis ||
      null,
    status: result.status || "Finished",
  }));
}

export async function fetchDriverStandings(year: number) {
  const data = await safeFetch(`${BASE}/${year}/driverStandings.json`);
  const list = data?.MRData?.StandingsTable?.StandingsLists?.[0];
  const standings = list?.DriverStandings || [];

  return standings.map((item: any) => ({
    driver_name: `${item.Driver?.givenName || ""} ${item.Driver?.familyName || ""}`.trim(),
    constructor_name: item.Constructors?.[0]?.name || null,
    position: item.position ? parseInt(item.position, 10) : null,
    points: item.points ? parseFloat(item.points) : 0,
    wins: item.wins ? parseInt(item.wins, 10) : 0,
  }));
}

export async function fetchConstructorStandings(year: number) {
  const data = await safeFetch(`${BASE}/${year}/constructorStandings.json`);
  const list = data?.MRData?.StandingsTable?.StandingsLists?.[0];
  const standings = list?.ConstructorStandings || [];

  return standings.map((item: any) => ({
    constructor_name: item.Constructor?.name || null,
    position: item.position ? parseInt(item.position, 10) : null,
    points: item.points ? parseFloat(item.points) : 0,
    wins: item.wins ? parseInt(item.wins, 10) : 0,
  }));
}
