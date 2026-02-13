import { createSupabaseServer } from "./supabase/server";
import { getUserRole, isAdminRole } from "./roles";

export async function requireAdminSession() {
  const supabase = await createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("No session found");
  }

  const role = getUserRole(session.user);
  if (!isAdminRole(role)) {
    throw new Error("Admin access required");
  }

  return session;
}
