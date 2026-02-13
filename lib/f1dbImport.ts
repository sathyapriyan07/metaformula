// F1DB Data Import Utility
// Source: https://github.com/f1db/f1db
// License: CC BY 4.0

const F1DB_BASE = "https://raw.githubusercontent.com/f1db/f1db/main/src/data";

export async function fetchF1DBDrivers() {
  const res = await fetch(`${F1DB_BASE}/drivers.csv`);
  const csv = await res.text();
  return parseCSV(csv);
}

export async function fetchF1DBConstructors() {
  const res = await fetch(`${F1DB_BASE}/constructors.csv`);
  const csv = await res.text();
  return parseCSV(csv);
}

export async function fetchF1DBCircuits() {
  const res = await fetch(`${F1DB_BASE}/circuits.csv`);
  const csv = await res.text();
  return parseCSV(csv);
}

export async function fetchF1DBSeasons() {
  const res = await fetch(`${F1DB_BASE}/seasons.csv`);
  const csv = await res.text();
  return parseCSV(csv);
}

export async function fetchF1DBRaces() {
  const res = await fetch(`${F1DB_BASE}/races.csv`);
  const csv = await res.text();
  return parseCSV(csv);
}

export async function fetchF1DBRaceResults() {
  const res = await fetch(`${F1DB_BASE}/race-results.csv`);
  const csv = await res.text();
  return parseCSV(csv);
}

export async function fetchF1DBDriverStandings() {
  const res = await fetch(`${F1DB_BASE}/driver-standings.csv`);
  const csv = await res.text();
  return parseCSV(csv);
}

export async function fetchF1DBConstructorStandings() {
  const res = await fetch(`${F1DB_BASE}/constructor-standings.csv`);
  const csv = await res.text();
  return parseCSV(csv);
}

function parseCSV(csv: string): any[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(",").map(h => h.trim());
  const rows = lines.slice(1);
  
  return rows.map(row => {
    const values = parseCSVLine(row);
    const obj: any = {};
    
    headers.forEach((header, i) => {
      const value = values[i]?.trim();
      obj[header] = value === "" || value === "NULL" ? null : value;
    });
    
    return obj;
  }).filter(row => Object.values(row).some(v => v !== null));
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}
