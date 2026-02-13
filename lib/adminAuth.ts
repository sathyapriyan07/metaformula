import { createSupabaseServer } from "./supabase/server";
import { getUserRole, isAdminRole } from "./roles";

export async function verifyAdminRole() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { isAdmin: false, error: "Unauthorized", user: null, role: null };
  }

  const role = getUserRole(user);
  if (!isAdminRole(role)) {
    return { isAdmin: false, error: "Admin access required", user, role };
  }

  return { isAdmin: true, error: null, user, role };
}
