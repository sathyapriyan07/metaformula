"use client";
import { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";

interface SearchResult {
  id: number;
  name: string;
  type: "driver" | "team" | "circuit" | "season" | "timeline";
  subtitle?: string;
}

interface GlobalSearchProps {
  variant?: "button" | "input";
  showMobileIcon?: boolean;
  className?: string;
}

export default function GlobalSearch({
  variant = "button",
  showMobileIcon = true,
  className,
}: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
        setSelectedIndex(0);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await res.json();
        setResults(data.results || []);
        setSelectedIndex(0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) acc[result.type] = [];
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  const getLink = (result: SearchResult) => {
    switch (result.type) {
      case "driver":
        return `/drivers/${result.id}`;
      case "team":
        return `/teams/${result.id}`;
      case "circuit":
        return `/circuits/${result.id}`;
      case "season":
        return `/seasons/${result.id}`;
      case "timeline":
        return "/timeline";
      default:
        return "/";
    }
  };

  const typeLabels: Record<string, string> = {
    driver: "Drivers",
    team: "Teams",
    circuit: "Circuits",
    season: "Seasons",
    timeline: "Timeline",
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      const link = getLink(results[selectedIndex]);
      router.push(link);
      setIsOpen(false);
      setQuery("");
    }
  };

  const desktopTrigger =
    variant === "input" ? (
      <button
        onClick={() => setIsOpen(true)}
        className={clsx(
          "hidden md:flex h-11 w-full min-w-[260px] max-w-[460px] items-center gap-3 rounded-full border border-white/15 bg-[#111111] px-4 text-left transition-all duration-200 hover:border-f1-red/40 focus:outline-none focus:ring-2 focus:ring-f1-red/50",
          className
        )}
        aria-label="Open global search"
      >
        <svg className="h-4 w-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="flex-1 truncate text-sm text-white/60">Search drivers, teams, seasons...</span>
        <span className="rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-white/50">
          Ctrl/Cmd + K
        </span>
      </button>
    ) : (
      <button
        onClick={() => setIsOpen(true)}
        className={clsx(
          "hidden md:flex items-center gap-2 rounded-xl border border-white/10 bg-[#111] px-4 py-2 text-sm text-white/60 transition-colors hover:border-white/20 hover:text-white",
          className
        )}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Search</span>
        <kbd className="rounded border border-white/10 bg-white/10 px-2 py-0.5 text-xs">Ctrl/Cmd + K</kbd>
      </button>
    );

  return (
    <>
      {desktopTrigger}

      {showMobileIcon ? (
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden rounded-lg p-2 text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Open global search"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      ) : null}

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-20 md:pt-28">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c] shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/10 px-6 py-4">
              <svg className="h-5 w-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Search drivers, teams, seasons..."
                className="flex-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none"
                autoFocus
              />
              <button onClick={() => setIsOpen(false)} className="text-white/50 transition-colors hover:text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {loading ? <div className="p-8 text-center text-white/50">Searching...</div> : null}

              {!loading && query && results.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="mb-2 text-white/50">No results found</div>
                  <div className="text-sm text-white/30">Try a different search term</div>
                </div>
              ) : null}

              {!loading && results.length > 0 ? (
                <div className="space-y-4 p-4">
                  {Object.entries(groupedResults).map(([type, items]) => (
                    <div key={type}>
                      <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-white/50">{typeLabels[type]}</div>
                      <div className="space-y-1">
                        {items.map((result) => {
                          const globalIndex = results.indexOf(result);
                          return (
                            <Link
                              key={`${result.type}-${result.id}`}
                              href={getLink(result)}
                              onClick={() => {
                                setIsOpen(false);
                                setQuery("");
                              }}
                              className={`block rounded-lg px-4 py-3 transition-colors ${
                                globalIndex === selectedIndex ? "bg-white/10" : "hover:bg-white/5"
                              }`}
                            >
                              <div className="font-medium text-white">{result.name}</div>
                              {result.subtitle ? <div className="mt-0.5 text-sm text-white/50">{result.subtitle}</div> : null}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {!loading && results.length > 0 ? (
              <div className="flex items-center gap-4 border-t border-white/10 px-6 py-3 text-xs text-white/40">
                <div className="flex items-center gap-1">
                  <kbd className="rounded border border-white/10 bg-white/10 px-1.5 py-0.5">Up/Down</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="rounded border border-white/10 bg-white/10 px-1.5 py-0.5">Enter</kbd>
                  <span>Select</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="rounded border border-white/10 bg-white/10 px-1.5 py-0.5">Esc</kbd>
                  <span>Close</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
