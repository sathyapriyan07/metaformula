"use client";

import { useState, useEffect } from "react";
import { createSupabaseBrowser } from "../../../lib/supabase/client";

export default function ErgastImportPage() {
  const [token, setToken] = useState<string | null>(null);
  const [type, setType] = useState("seasons");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [preview, setPreview] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowser();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setToken(session?.access_token || null);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setToken(session?.access_token || null);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const handlePreview = async () => {
    if (!token) return;
    setLoading(true);
    setMessage(null);
    setPreview([]);

    try {
      const url = type === "seasons" || type === "circuits"
        ? `/api/ergast/import?type=${type}`
        : `/api/ergast/import?type=${type}&year=${year}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      setPreview(result.data);
      setMessage({ text: `${result.count} items found`, type: "success" });
    } catch (error: any) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!token || preview.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch("/api/ergast/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type, data: preview }),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      setMessage({ text: `Imported ${result.imported} items`, type: "success" });
      setPreview([]);
    } catch (error: any) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="glass rounded-2xl p-8">
        <p className="text-white/60">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2">Ergast Import Tool</h1>
        <p className="text-white/60">Import historical F1 data from Ergast API</p>
        <div className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-sm text-yellow-400">⚠️ Admin Only: Preview before importing</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">Import Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl bg-black/60 border border-white/10 px-4 py-3 text-white"
              suppressHydrationWarning
            >
              <option value="seasons">Seasons</option>
              <option value="drivers">Drivers</option>
              <option value="constructors">Constructors</option>
              <option value="circuits">Circuits</option>
              <option value="races">Races</option>
              <option value="driver_standings">Driver Standings</option>
              <option value="constructor_standings">Constructor Standings</option>
            </select>
          </div>

          {type !== "seasons" && type !== "circuits" && (
            <div>
              <label className="block text-sm text-white/60 mb-2">Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="1950"
                max={new Date().getFullYear()}
                className="w-full rounded-xl bg-black/60 border border-white/10 px-4 py-3 text-white"
                suppressHydrationWarning
              />
            </div>
          )}

          <button
            onClick={handlePreview}
            disabled={loading}
            className="w-full px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50"
            suppressHydrationWarning
          >
            {loading ? "Loading..." : "Preview Data"}
          </button>
        </div>

        {message && (
          <div className={`mt-4 p-4 rounded-xl ${message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
            {message.text}
          </div>
        )}

        {preview.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="max-h-96 overflow-y-auto space-y-2">
              {preview.slice(0, 10).map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <pre className="text-xs text-white/80 overflow-x-auto">
                    {JSON.stringify(item, null, 2)}
                  </pre>
                </div>
              ))}
              {preview.length > 10 && (
                <p className="text-sm text-white/50 text-center">
                  ...and {preview.length - 10} more items
                </p>
              )}
            </div>

            <button
              onClick={handleImport}
              disabled={loading}
              className="w-full px-6 py-3 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:opacity-50"
              suppressHydrationWarning
            >
              {loading ? "Importing..." : `Import ${preview.length} Items`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
