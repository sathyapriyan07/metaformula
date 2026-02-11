import { NextResponse } from "next/server";
import { timelineEventSchema } from "../../../../lib/validators";
import { deleteTimelineEvent, getTimelineEvent, updateTimelineEvent } from "../../../../lib/queries";
import { requireAdminSession } from "../../../../lib/auth";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getTimelineEvent(Number(id));
  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(event);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const parsed = timelineEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const event = await updateTimelineEvent(Number(id), parsed.data);
  return NextResponse.json(event);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await deleteTimelineEvent(Number(id));
  return NextResponse.json({ ok: true });
}
