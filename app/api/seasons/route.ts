import { NextResponse } from "next/server";
import { seasonSchema } from "../../../lib/validators";
import { createSeason, listSeasons } from "../../../lib/queries";
import { requireAdminSession } from "../../../lib/auth";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await listSeasons());
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const parsed = seasonSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const season = await createSeason(parsed.data);
  return NextResponse.json(season);
}
