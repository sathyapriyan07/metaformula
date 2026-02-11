import { NextResponse } from "next/server";
import { circuitSchema } from "../../../../lib/validators";
import { deleteCircuit, getCircuit, updateCircuit } from "../../../../lib/queries";
import { requireAdminSession } from "../../../../lib/auth";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const circuit = await getCircuit(Number(id));
  if (!circuit) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(circuit);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const parsed = circuitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const circuit = await updateCircuit(Number(id), parsed.data);
  return NextResponse.json(circuit);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await deleteCircuit(Number(id));
  return NextResponse.json({ ok: true });
}
