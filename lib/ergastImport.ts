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
