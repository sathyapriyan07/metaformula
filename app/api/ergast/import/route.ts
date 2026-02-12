import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "../../../../lib/supabase/server";
import {
  fetchSeasons,
  fetchDrivers,
  fetchConstructors,
  fetchCircuits,
  fetchRaces,
} from "../../../../lib/ergastImport";

const VALID_TYPES = ["seasons", "drivers", "constructors", "circuits", "races", "driver_standings", "constructor_standings"] as const;
type ImportType = typeof VALID_TYPES[number];

async function checkAdmin(request: NextRequest) {
  try {
    const supabase = createSupabaseAdmin();
    const authHeader = request.headers.get("authorization");
    if (!authHeader) return false;

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return false;

    return user.app_metadata?.role === "admin";
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  if (!await checkAdmin(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type");
  const year = searchParams.get("year");

  const currentYear = new Date().getFullYear();
  const yearNum = year ? parseInt(year) : currentYear;

  if (yearNum < 1950 || yearNum > currentYear) {
    return NextResponse.json({ success: false, message: "Season not supported" }, { status: 400 });
  }

  try {
    let data: any[];

    switch (type) {
      case "seasons":
        data = await fetchSeasons();
        break;
      case "drivers":
        data = await fetchDrivers(yearNum);
        break;
      case "constructors":
        data = await fetchConstructors(yearNum);
        break;
      case "circuits":
        data = await fetchCircuits();
        break;
      case "races":
        data = await fetchRaces(yearNum);
        break;
      case "driver_standings":
        const dsRes = await fetch(`https://api.jolpi.ca/ergast/f1/${yearNum}/driverStandings.json`);
        const dsData = await dsRes.json();
        const standings = dsData.MRData.StandingsTable.StandingsLists[0];
        data = standings?.DriverStandings.map((s: any) => ({
          ...s,
          season: standings.season
        })) || [];
        break;
      case "constructor_standings":
        const csRes = await fetch(`https://api.jolpi.ca/ergast/f1/${yearNum}/constructorStandings.json`);
        const csData = await csRes.json();
        const csStandings = csData.MRData.StandingsTable.StandingsLists[0];
        data = csStandings?.ConstructorStandings.map((s: any) => ({
          ...s,
          season: csStandings.season
        })) || [];
        break;
      default:
        return NextResponse.json({ success: false, message: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true, type, data, count: data.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Ergast unavailable" }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  if (!await checkAdmin(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, data } = body;
    const supabase = createSupabaseAdmin();
    let imported = 0;

    switch (type) {
      case "seasons":
        for (const item of data) {
          const { error } = await supabase
            .from("seasons")
            .insert({ year: item.year });
          if (error) console.error('Season import error:', error);
          else imported++;
        }
        break;

      case "drivers":
        for (const item of data) {
          const { error } = await supabase
            .from("drivers")
            .insert({
              name: item.name,
              nationality: item.nationality,
              birthdate: item.birthdate,
            });
          if (error) console.error('Driver import error:', error);
          else imported++;
        }
        break;

      case "constructors":
        for (const item of data) {
          const { error } = await supabase
            .from("teams")
            .insert({
              team_name: item.team_name,
              base_country: item.base_country,
            });
          if (error) console.error('Team import error:', error);
          else imported++;
        }
        break;

      case "circuits":
        for (const item of data) {
          const { error } = await supabase
            .from("circuits")
            .insert({
              circuit_name: item.name,
              country: item.country,
            });
          if (error) console.error('Circuit import error:', error);
          else imported++;
        }
        break;

      case "races":
        const { data: season } = await supabase.from("seasons").select("id").eq("year", data[0]?.year).single();
        if (!season) return NextResponse.json({ success: false, message: "Season not found. Import season first." }, { status: 400 });
        
        for (const item of data) {
          const { data: circuit } = await supabase.from("circuits").select("id").eq("circuit_name", item.circuit_name).single();
          if (!circuit) continue;
          
          const { error } = await supabase.from("races").insert({
            season_id: season.id,
            circuit_id: circuit.id,
            laps: item.laps || 0,
          });
          if (error) console.error('Race import error:', error);
          else imported++;
        }
        break;

      case "driver_standings":
        if (!data[0]?.season) return NextResponse.json({ success: false, message: "Invalid data" }, { status: 400 });
        
        let { data: dsSeason } = await supabase.from("seasons").select("id").eq("year", parseInt(data[0].season)).single();
        if (!dsSeason) {
          const { data: newSeason } = await supabase.from("seasons").insert({ year: parseInt(data[0].season) }).select().single();
          dsSeason = newSeason;
        }
        if (!dsSeason) return NextResponse.json({ success: false, message: "Failed to create season" }, { status: 400 });
        
        for (const item of data) {
          const { data: driver } = await supabase.from("drivers").select("id").eq("name", `${item.Driver.givenName} ${item.Driver.familyName}`).single();
          if (!driver) continue;
          
          const { error } = await supabase.from("driver_standings").insert({
            season_id: dsSeason.id,
            driver_id: driver.id,
            position: parseInt(item.position),
            points: parseFloat(item.points),
            wins: parseInt(item.wins),
          });
          if (error) console.error('Driver standings error:', error);
          else imported++;
        }
        break;

      case "constructor_standings":
        if (!data[0]?.season) return NextResponse.json({ success: false, message: "Invalid data" }, { status: 400 });
        
        let { data: csSeason } = await supabase.from("seasons").select("id").eq("year", parseInt(data[0].season)).single();
        if (!csSeason) {
          const { data: newSeason } = await supabase.from("seasons").insert({ year: parseInt(data[0].season) }).select().single();
          csSeason = newSeason;
        }
        if (!csSeason) return NextResponse.json({ success: false, message: "Failed to create season" }, { status: 400 });
        
        for (const item of data) {
          const { data: team } = await supabase.from("teams").select("id").eq("team_name", item.Constructor.name).single();
          if (!team) continue;
          
          const { error } = await supabase.from("constructor_standings").insert({
            season_id: csSeason.id,
            team_id: team.id,
            position: parseInt(item.position),
            points: parseFloat(item.points),
            wins: parseInt(item.wins),
          });
          if (error) console.error('Constructor standings error:', error);
          else imported++;
        }
        break;

      default:
        return NextResponse.json({ success: false, message: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true, type, imported });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Import failed" }, { status: 500 });
  }
}
