import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "../../../../lib/supabase/server";
import {
  fetchOpenF1Drivers,
  fetchOpenF1Teams,
  fetchOpenF1Circuits,
  fetchOpenF1Sessions,
  OpenF1Error,
} from "../../../../lib/openf1";

const VALID_TYPES = ["drivers", "teams", "circuits", "sessions"] as const;
type ImportType = typeof VALID_TYPES[number];

function validateImportType(type: string): type is ImportType {
  return VALID_TYPES.includes(type as ImportType);
}

async function checkAdminAuth(request: NextRequest): Promise<boolean> {
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
  const isAdmin = await checkAdminAuth(request);
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");
  const yearParam = searchParams.get("year");

  if (!type || !validateImportType(type)) {
    return NextResponse.json(
      { success: false, message: "Invalid import type" },
      { status: 400 }
    );
  }

  const year = yearParam ? parseInt(yearParam) : undefined;

  if (year && year < 2000) {
    return NextResponse.json({
      success: false,
      message: "Manual import required for historical seasons",
    });
  }

  try {
    let data: any[];

    switch (type) {
      case "drivers":
        data = await fetchOpenF1Drivers();
        break;
      case "teams":
        data = await fetchOpenF1Teams();
        break;
      case "circuits":
        data = await fetchOpenF1Circuits();
        break;
      case "sessions":
        data = await fetchOpenF1Sessions(year);
        break;
    }

    if (process.env.NODE_ENV === "development") {
      console.log(`[OpenF1] Fetched ${data.length} ${type}`);
    }

    return NextResponse.json({
      success: true,
      data,
      count: data.length,
      type,
    });
  } catch (error) {
    if (error instanceof OpenF1Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Provider unavailable" },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  const isAdmin = await checkAdminAuth(request);
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { drivers, teams, circuits, sessions, constructors, season, type } = await request.json();
    const supabase = createSupabaseAdmin();
    let imported = 0;

    if (type === "drivers" && drivers && Array.isArray(drivers)) {
      for (const driver of drivers) {
        if (!driver.name) continue;

        const { error } = await supabase
          .from("drivers")
          .upsert(
            {
              name: driver.name,
              nationality: driver.nationality,
              birthdate: driver.birthdate,
              number: driver.number,
              championships: 0,
              wins: 0,
              podiums: 0,
              poles: 0,
              fastest_laps: 0,
              status: driver.status || "published",
            },
            { onConflict: "name" }
          );

        if (!error) imported++;
      }

      if (process.env.NODE_ENV === "development") {
        console.log(`[Import] Imported ${imported} drivers`);
      }

      return NextResponse.json({ success: true, imported, count: imported, type: "drivers" });
    }

    if (type === "teams" && teams && Array.isArray(teams)) {
      for (const team of teams) {
        if (!team.team_name) continue;

        const { error } = await supabase
          .from("teams")
          .upsert(
            {
              team_name: team.team_name,
              base_country: team.base_country,
              championships: 0,
              status: team.status || "published",
            },
            { onConflict: "team_name" }
          );

        if (!error) imported++;
      }

      if (process.env.NODE_ENV === "development") {
        console.log(`[Import] Imported ${imported} teams`);
      }

      return NextResponse.json({ success: true, imported, count: imported, type: "teams" });
    }

    if (type === "constructors" && constructors && Array.isArray(constructors)) {
      for (const constructor of constructors) {
        if (!constructor.team_name) continue;

        const { error } = await supabase
          .from("teams")
          .upsert(
            {
              team_name: constructor.team_name,
              base_country: constructor.nationality || constructor.base_country,
              championships: 0,
              status: "published",
            },
            { onConflict: "team_name" }
          );

        if (!error) imported++;
      }

      if (process.env.NODE_ENV === "development") {
        console.log(`[Import] Imported ${imported} constructors`);
      }

      return NextResponse.json({ success: true, imported, count: imported, type: "constructors" });
    }

    if (type === "circuits" && circuits && Array.isArray(circuits)) {
      for (const circuit of circuits) {
        if (!circuit.circuit_name) continue;

        const { error } = await supabase
          .from("circuits")
          .upsert(
            {
              circuit_name: circuit.circuit_name,
              country: circuit.country,
              locality: circuit.locality,
              status: circuit.status || "published",
            },
            { onConflict: "circuit_name" }
          );

        if (!error) imported++;
      }

      if (process.env.NODE_ENV === "development") {
        console.log(`[Import] Imported ${imported} circuits`);
      }

      return NextResponse.json({ success: true, imported, count: imported, type: "circuits" });
    }

    if (type === "sessions" && sessions && Array.isArray(sessions)) {
      for (const session of sessions) {
        if (!session.race_name || !session.date) continue;

        const { error } = await supabase
          .from("races")
          .upsert(
            {
              race_name: session.race_name,
              date: session.date,
              year: session.year,
              status: session.status || "published",
            },
            { onConflict: "race_name,year" }
          );

        if (!error) imported++;
      }

      if (process.env.NODE_ENV === "development") {
        console.log(`[Import] Imported ${imported} sessions`);
      }

      return NextResponse.json({ success: true, imported, count: imported, type: "sessions" });
    }

    if (type === "seasons" && season) {
      const { data, error } = await supabase
        .from("seasons")
        .upsert(
          {
            year: season.year,
            total_races: season.total_races,
            status: "published",
          },
          { onConflict: "year" }
        )
        .select()
        .single();

      if (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json(
      { success: false, message: "Invalid data" },
      { status: 400 }
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Import Error]", error);
    }

    return NextResponse.json(
      { success: false, message: "Import failed" },
      { status: 500 }
    );
  }
}
