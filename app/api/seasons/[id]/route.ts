import { NextResponse } from "next/server";
import { seasonSchema } from "../../../../lib/validators";
import { deleteSeason, getSeason, updateSeason } from "../../../../lib/queries";
import { requireAdminSession } from "../../../../lib/auth";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const season = await getSeason(Number(id));
  if (!season) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(season);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const parsed = seasonSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const season = await updateSeason(Number(id), parsed.data);
  return NextResponse.json(season);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await deleteSeason(Number(id));
  return NextResponse.json({ ok: true });
}
