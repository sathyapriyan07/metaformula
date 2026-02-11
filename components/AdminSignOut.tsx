"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "../lib/supabase/client";

export default function AdminSignOut() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <button
      onClick={handleSignOut}
      className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-f1-muted"
    >
      Sign Out
    </button>
  );
}
