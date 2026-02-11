import { NextResponse } from "next/server";
import { driverSchema } from "../../../lib/validators";
import { createDriver, listDrivers } from "../../../lib/queries";
import { requireAdminSession } from "../../../lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const drivers = await listDrivers();
  return NextResponse.json(drivers);
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const parsed = driverSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const driver = await createDriver(parsed.data);
  return NextResponse.json(driver);
}
