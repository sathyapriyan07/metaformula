import { NextResponse } from "next/server";
import { raceSchema } from "../../../lib/validators";
import { createRace, listRaces } from "../../../lib/queries";
import { requireAdminSession } from "../../../lib/auth";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await listRaces());
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const parsed = raceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const race = await createRace(parsed.data);
  return NextResponse.json(race);
}
