import { NextResponse } from "next/server";
import { mediaSchema } from "../../../lib/validators";
import { createMedia, listMedia } from "../../../lib/queries";
import { requireAdminSession } from "../../../lib/auth";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await listMedia());
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const parsed = mediaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const media = await createMedia(parsed.data);
  return NextResponse.json(media);
}
