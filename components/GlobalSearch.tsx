"use client";
import { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import Link from "next/link";

interface SearchResult {
  id: number;
  name: string;
  type: "driver" | "team" | "circuit" | "season" | "race";
  subtitle?: string;
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (error) {
        console.error("Search error:", error);
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
      case "driver": return `/drivers/${result.id}`;
      case "team": return `/teams/${result.id}`;
      case "circuit": return `/circuits/${result.id}`;
      case "season": return `/seasons/${result.id}`;
      case "race": return `/races/${result.id}`;
      default: return "/";
    }
  };

  const typeLabels: Record<string, string> = {
    driver: "Drivers",
    team: "Teams",
    circuit: "Circuits",
    season: "Seasons",
    race: "Races",
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-white/60 hover:text-white"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Search</span>
        <kbd className="px-2 py-0.5 text-xs bg-white/10 rounded">/</kbd>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative w-full max-w-2xl glass rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
              <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search drivers, teams, circuits..."
                className="flex-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none"
                autoFocus
              />
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {loading && (
                <div className="p-8 text-center text-white/50">Searching...</div>
              )}

              {!loading && query && results.length === 0 && (
                <div className="p-8 text-center">
                  <div className="text-white/50 mb-2">No results found</div>
                  <div className="text-sm text-white/30">Try a different search term</div>
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="p-4 space-y-4">
                  {Object.entries(groupedResults).map(([type, items]) => (
                    <div key={type}>
                      <div className="text-xs text-white/50 mb-2 px-2">{typeLabels[type]}</div>
                      <div className="space-y-1">
                        {items.map((result) => (
                          <Link
                            key={`${result.type}-${result.id}`}
                            href={getLink(result)}
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-3 rounded-xl hover:bg-white/10"
                          >
                            <div className="font-medium">{result.name}</div>
                            {result.subtitle && (
                              <div className="text-sm text-white/50">{result.subtitle}</div>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
