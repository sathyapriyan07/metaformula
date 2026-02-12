const OPENF1_BASE = "https://api.openf1.org/v1";
const FETCH_TIMEOUT = 10000;

export class OpenF1Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OpenF1Error";
  }
}

async function safeFetch(url: string): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new OpenF1Error("Provider unavailable");
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      throw new OpenF1Error("Provider unavailable");
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof OpenF1Error) throw error;
    throw new OpenF1Error("Provider unavailable");
  }
}

export async function fetchOpenF1Drivers(): Promise<any[]> {
  try {
    const data = await safeFetch(`${OPENF1_BASE}/drivers`);
    
    if (!Array.isArray(data)) {
      throw new OpenF1Error("Invalid response structure");
    }

    return data
      .filter((d: any) => d.driver_name && d.driver_number)
      .map((d: any) => ({
        name: d.driver_name,
        nationality: d.country_code || null,
        number: d.driver_number || null,
        team: d.team_name || null,
        status: "published",
      }));
  } catch (error) {
    if (error instanceof OpenF1Error) throw error;
    throw new OpenF1Error("Provider unavailable");
  }
}

export async function fetchOpenF1Teams(): Promise<any[]> {
  try {
    const data = await safeFetch(`${OPENF1_BASE}/teams`);
    
    if (!Array.isArray(data)) {
      throw new OpenF1Error("Invalid response structure");
    }

    return data
      .filter((t: any) => t.team_name)
      .map((t: any) => ({
        team_name: t.team_name,
        base_country: t.country_code || null,
        status: "published",
      }));
  } catch (error) {
    if (error instanceof OpenF1Error) throw error;
    throw new OpenF1Error("Provider unavailable");
  }
}

export async function fetchOpenF1Circuits(): Promise<any[]> {
  try {
    const data = await safeFetch(`${OPENF1_BASE}/meetings`);
    
    if (!Array.isArray(data)) {
      throw new OpenF1Error("Invalid response structure");
    }

    const uniqueCircuits = new Map();
    
    data.forEach((m: any) => {
      if (m.meeting_name && m.country_name) {
        const key = m.meeting_name;
        if (!uniqueCircuits.has(key)) {
          uniqueCircuits.set(key, {
            circuit_name: m.meeting_name,
            country: m.country_name,
            locality: m.location || null,
            status: "published",
          });
        }
      }
    });

    return Array.from(uniqueCircuits.values());
  } catch (error) {
    if (error instanceof OpenF1Error) throw error;
    throw new OpenF1Error("Provider unavailable");
  }
}

export async function fetchOpenF1Sessions(year?: number): Promise<any[]> {
  try {
    const url = year 
      ? `${OPENF1_BASE}/sessions?year=${year}`
      : `${OPENF1_BASE}/sessions`;
    
    const data = await safeFetch(url);
    
    if (!Array.isArray(data)) {
      throw new OpenF1Error("Invalid response structure");
    }

    return data
      .filter((s: any) => s.session_name && s.date_start)
      .map((s: any) => ({
        race_name: s.session_name,
        circuit_id: s.meeting_key || null,
        date: s.date_start,
        year: year || new Date(s.date_start).getFullYear(),
        status: "published",
      }));
  } catch (error) {
    if (error instanceof OpenF1Error) throw error;
    throw new OpenF1Error("Provider unavailable");
  }
}
