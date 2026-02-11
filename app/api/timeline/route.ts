import { NextResponse } from "next/server";
import { timelineEventSchema } from "../../../lib/validators";
import { createTimelineEvent, listTimelineEvents } from "../../../lib/queries";
import { requireAdminSession } from "../../../lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const events = await listTimelineEvents();
  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const parsed = timelineEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const event = await createTimelineEvent(parsed.data);
  return NextResponse.json(event);
}
