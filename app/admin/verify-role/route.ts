import { createSupabaseServer } from "../../../lib/supabase/server";
import { getRoleFromMetadata, getUserRole, isAdminUser } from "../../../lib/roles";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return Response.json(
      {
        authenticated: false,
        isAdmin: false,
        role: null,
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  return Response.json({
    authenticated: true,
    isAdmin: isAdminUser(user),
    role: getUserRole(user),
    userId: user.id,
    email: user.email || null,
    roleSources: {
      user_metadata: getRoleFromMetadata(user.user_metadata),
      app_metadata: getRoleFromMetadata(user.app_metadata),
    },
  });
}
