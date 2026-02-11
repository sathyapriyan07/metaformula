"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // TEMP: replace with real auth later
  const isAdmin = true;

  useEffect(() => {
    if (!isAdmin) router.push("/");
  }, [isAdmin, router]);

  if (!isAdmin) return null;

  return <>{children}</>;
}
