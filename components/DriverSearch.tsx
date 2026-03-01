"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function DriverSearch({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [debounced] = useDebounce(query, 300);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const current = (params.get("q") ?? "").trim();
    const next = debounced.trim();

    if (next === current) return;

    if (next) params.set("q", next);
    else params.delete("q");

    const url = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(url, { scroll: false });
  }, [debounced, pathname, router, searchParams]);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search drivers by name..."
        className="h-12 w-full rounded-xl border border-white/15 bg-[#111111] px-4 text-white placeholder:text-white/40 outline-none transition-all duration-200 focus:border-f1-red/50 focus:ring-2 focus:ring-f1-red/40"
        aria-label="Search drivers by name"
      />
    </div>
  );
}
