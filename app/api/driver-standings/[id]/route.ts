import { NextResponse } from "next/server";
import { driverStandingSchema } from "../../../../lib/validators";
import { deleteDriverStanding, getDriverStanding, updateDriverStanding } from "../../../../lib/queries";
import { requireAdminSession } from "../../../../lib/auth";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const standing = await getDriverStanding(Number(id));
  if (!standing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(standing);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const parsed = driverStandingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const standing = await updateDriverStanding(Number(id), parsed.data);
  return NextResponse.json(standing);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await deleteDriverStanding(Number(id));
  return NextResponse.json({ ok: true });
}
