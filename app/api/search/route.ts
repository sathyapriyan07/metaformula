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
    const { data: drivers } = await supabase
      .from("drivers")
      .select("id, name, nationality")
      .or(`name.ilike.%${query}%,nationality.ilike.%${query}%`)
      .limit(5);

    if (drivers) {
      results.push(
        ...drivers.map((d) => ({
          id: d.id,
          name: d.name,
          type: "driver",
          subtitle: d.nationality || undefined,
        }))
      );
    }

    const { data: teams } = await supabase
      .from("teams")
      .select("id, team_name, base_country")
      .ilike("team_name", `%${query}%`)
      .limit(5);

    if (teams) {
      results.push(
        ...teams.map((t) => ({
          id: t.id,
          name: t.team_name,
          type: "team",
          subtitle: t.base_country || undefined,
        }))
      );
    }

    const { data: circuits } = await supabase
      .from("circuits")
      .select("id, circuit_name, country")
      .or(`circuit_name.ilike.%${query}%,country.ilike.%${query}%`)
      .limit(5);

    if (circuits) {
      results.push(
        ...circuits.map((c) => ({
          id: c.id,
          name: c.circuit_name,
          type: "circuit",
          subtitle: c.country || undefined,
        }))
      );
    }

    const { data: seasons } = await supabase
      .from("seasons")
      .select("id, year")
      .limit(10);

    if (seasons) {
      const filtered = seasons.filter((s) => String(s.year).includes(query));
      results.push(
        ...filtered.map((s) => ({
          id: s.id,
          name: `${s.year} Season`,
          type: "season",
        }))
      );
    }

    return NextResponse.json({ results: results.slice(0, 20) });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ results: [] });
  }
}
