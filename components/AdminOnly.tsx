"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseBrowser } from "../lib/supabase/client";
import { isAdminUser } from "../lib/roles";

type AccessState = "loading" | "allowed" | "denied";

export default function AdminOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [accessState, setAccessState] = useState<AccessState>("loading");

  useEffect(() => {
    if (pathname.startsWith("/admin/login")) {
      setAccessState("allowed");
      return;
    }

    let active = true;
    const supabase = createSupabaseBrowser();

    const updateAccess = (sessionUser: Parameters<typeof isAdminUser>[0]) => {
      if (!active) {
        return;
      }

      if (isAdminUser(sessionUser)) {
        setAccessState("allowed");
        return;
      }

      setAccessState("denied");
      router.replace("/");
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      updateAccess(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      updateAccess(session?.user ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (!pathname.startsWith("/admin/login") && accessState !== "allowed") {
    return null;
  }

  return <>{children}</>;
}
