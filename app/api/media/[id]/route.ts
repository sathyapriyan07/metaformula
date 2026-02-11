import { NextResponse } from "next/server";
import { mediaSchema } from "../../../../lib/validators";
import { deleteMedia, getMedia, updateMedia } from "../../../../lib/queries";
import { requireAdminSession } from "../../../../lib/auth";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const media = await getMedia(Number(id));
  if (!media) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(media);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const parsed = mediaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const media = await updateMedia(Number(id), parsed.data);
  return NextResponse.json(media);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await deleteMedia(Number(id));
  return NextResponse.json({ ok: true });
}
