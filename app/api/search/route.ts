import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "../../../lib/supabase/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q")?.toLowerCase() || "";

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const supabase = createSupabaseAdmin();
  const results: any[] = [];

  try {
    const [driversRes, teamsRes, circuitsRes, seasonsRes, timelineRes] = await Promise.all([
      supabase
        .from("drivers")
        .select("id, name, nationality")
        .or(`name.ilike.%${query}%,nationality.ilike.%${query}%`)
        .limit(5),
      supabase
        .from("teams")
        .select("id, team_name, base_country")
        .ilike("team_name", `%${query}%`)
        .limit(5),
      supabase
        .from("circuits")
        .select("id, circuit_name, country")
        .or(`circuit_name.ilike.%${query}%,country.ilike.%${query}%`)
        .limit(5),
      supabase
        .from("seasons")
        .select("id, year")
        .limit(20),
      supabase
        .from("timeline_events")
        .select("id, title, year")
        .ilike("title", `%${query}%`)
        .limit(5),
    ]);

    if (driversRes.data) {
      results.push(
        ...driversRes.data.map((d) => ({
          id: d.id,
          name: d.name,
          type: "driver",
          subtitle: d.nationality || undefined,
        }))
      );
    }

    if (teamsRes.data) {
      results.push(
        ...teamsRes.data.map((t) => ({
          id: t.id,
          name: t.team_name,
          type: "team",
          subtitle: t.base_country || undefined,
        }))
      );
    }

    if (circuitsRes.data) {
      results.push(
        ...circuitsRes.data.map((c) => ({
          id: c.id,
          name: c.circuit_name,
          type: "circuit",
          subtitle: c.country || undefined,
        }))
      );
    }

    if (seasonsRes.data) {
      const filtered = seasonsRes.data.filter((s) => String(s.year).includes(query));
      results.push(
        ...filtered.slice(0, 5).map((s) => ({
          id: s.year,
          name: `${s.year} Season`,
          type: "season",
        }))
      );
    }

    if (timelineRes.data) {
      results.push(
        ...timelineRes.data.map((t) => ({
          id: t.id,
          name: t.title,
          type: "timeline",
          subtitle: t.year ? `${t.year}` : undefined,
        }))
      );
    }

    return NextResponse.json({ results: results.slice(0, 25) });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ results: [] });
  }
}
