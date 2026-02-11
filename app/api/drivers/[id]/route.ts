import { NextResponse } from "next/server";
import { driverSchema } from "../../../../lib/validators";
import { deleteDriver, getDriver, updateDriver } from "../../../../lib/queries";
import { requireAdminSession } from "../../../../lib/auth";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const driver = await getDriver(Number(id));
  if (!driver) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(driver);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const parsed = driverSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const driver = await updateDriver(Number(id), parsed.data);
  return NextResponse.json(driver);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await deleteDriver(Number(id));
  return NextResponse.json({ ok: true });
}
