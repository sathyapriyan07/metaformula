import { NextResponse } from "next/server";
import { constructorStandingSchema } from "../../../lib/validators";
import { createConstructorStanding, listConstructorStandings } from "../../../lib/queries";
import { requireAdminSession } from "../../../lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const standings = await listConstructorStandings();
  return NextResponse.json(standings);
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const parsed = constructorStandingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const standing = await createConstructorStanding(parsed.data);
  return NextResponse.json(standing);
}
