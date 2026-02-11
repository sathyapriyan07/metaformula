import { NextResponse } from "next/server";
import { circuitSchema } from "../../../lib/validators";
import { createCircuit, listCircuits } from "../../../lib/queries";
import { requireAdminSession } from "../../../lib/auth";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await listCircuits());
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const parsed = circuitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const circuit = await createCircuit(parsed.data);
  return NextResponse.json(circuit);
}
