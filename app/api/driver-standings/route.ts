import { NextResponse } from "next/server";
import { driverStandingSchema } from "../../../lib/validators";
import { createDriverStanding, listDriverStandings } from "../../../lib/queries";
import { requireAdminSession } from "../../../lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const standings = await listDriverStandings();
  return NextResponse.json(standings);
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const parsed = driverStandingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const standing = await createDriverStanding(parsed.data);
  return NextResponse.json(standing);
}
