import { NextResponse } from "next/server";
import { teamSchema } from "../../../lib/validators";
import { createTeam, listTeams } from "../../../lib/queries";
import { requireAdminSession } from "../../../lib/auth";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await listTeams());
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const parsed = teamSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const team = await createTeam(parsed.data);
  return NextResponse.json(team);
}
