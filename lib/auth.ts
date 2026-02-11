﻿import { createSupabaseServer } from "./supabase/server";

export async function requireAdminSession() {
  const supabase = await createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("No session found");
  }

  const role = session.user.app_metadata?.role;
  if (role !== "admin") {
    throw new Error("Admin access required");
  }

  return session;
}
