import { NextResponse } from "next/server";
import { teamSchema } from "../../../../lib/validators";
import { deleteTeam, getTeam, updateTeam } from "../../../../lib/queries";
import { requireAdminSession } from "../../../../lib/auth";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const team = await getTeam(Number(id));
  if (!team) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(team);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const parsed = teamSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const team = await updateTeam(Number(id), parsed.data);
  return NextResponse.json(team);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await deleteTeam(Number(id));
  return NextResponse.json({ ok: true });
}
