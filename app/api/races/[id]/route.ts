import { NextResponse } from "next/server";
import { raceSchema } from "../../../../lib/validators";
import { deleteRace, getRace, updateRace } from "../../../../lib/queries";
import { requireAdminSession } from "../../../../lib/auth";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const race = await getRace(Number(id));
  if (!race) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(race);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const parsed = raceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const race = await updateRace(Number(id), parsed.data);
  return NextResponse.json(race);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await deleteRace(Number(id));
  return NextResponse.json({ ok: true });
}
