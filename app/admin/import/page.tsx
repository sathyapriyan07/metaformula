"use client";

import { useState, useCallback, useEffect } from "react";
import { createSupabaseBrowser } from "../../../lib/supabase/client";
import ImportStatusBanner, { LoadingSkeleton } from "../../../components/ImportStatusBanner";

const Message = ({ text, type }: { text: string; type: "success" | "error" }) => (
  <div className={`p-4 rounded-xl mb-4 ${type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
    {text}
  </div>
);

export default function F1ImportPage() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowser();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setToken(session?.access_token || null);
    });
  }, []);

  if (!token) return <LoadingSkeleton />;

  return (
    <div className="space-y-8">
      <div className="glass rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2">F1 Data Import Tool</h1>
        <p className="text-white/60">
          Import historical F1 data using Jolpica API (primary) with Ergast fallback.
        </p>
        <div className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-sm text-yellow-400">
            ⚠️ Admin Only: Preview data before importing to database.
          </p>
        </div>
      </div>

      <SeasonImport token={token} />
      <DriversImport token={token} />
      <ConstructorsImport token={token} />
    </div>
  );
}

function SeasonImport({ token }: { token: string }) {
  const [year, setYear] = useState("");
  const [preview, setPreview] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handlePreview = async () => {
    setLoading(true);
    setMessage(null);
    setPreview(null);

    try {
      const res = await fetch(`/api/f1/import?year=${year}&type=seasons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch season");
      }

      setPreview(result.data);
      setMessage({ text: "Season Data Found", type: "success" });
    } catch (error: any) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!preview) return;
    setLoading(true);

    try {
      const res = await fetch("/api/f1/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ season: preview, type: "seasons" }),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to import season");
      }

      setMessage({ text: `Season ${preview.year} imported successfully`, type: "success" });
      setPreview(null);
      setYear("");
    } catch (error: any) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-4">Season Import</h2>

      <div className="flex gap-4 mb-4">
        <input
          type="number"
          placeholder="Year (e.g., 2023)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          min="1950"
          max={new Date().getFullYear()}
          className="flex-1 rounded-xl bg-black/60 border border-white/10 px-4 py-3 text-white placeholder:text-white/40"
          suppressHydrationWarning
        />
        <button
          onClick={handlePreview}
          disabled={loading || !year}
          className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
          suppressHydrationWarning
        >
          {loading ? "Loading..." : "Fetch Preview"}
        </button>
      </div>

      {message && <Message text={message.text} type={message.type} />}

      {preview && (
        <div className="space-y-4">
          <div className="glass-strong rounded-xl p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-white/50 mb-1">Year</div>
                <div className="text-lg font-bold">{preview.year}</div>
              </div>
              <div>
                <div className="text-xs text-white/50 mb-1">Total Races</div>
                <div className="text-lg font-bold">{preview.total_races}</div>
              </div>
            </div>
          </div>

          <button
            onClick={handleImport}
            disabled={loading}
            className="w-full px-6 py-3 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:opacity-50"
          >
            {loading ? "Importing..." : "Import Season"}
          </button>
        </div>
      )}
    </div>
  );
}

function DriversImport({ token }: { token: string }) {
  const [year, setYear] = useState("");
  const [preview, setPreview] = useState<any[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handlePreview = async () => {
    setLoading(true);
    setMessage(null);
    setPreview([]);
    setSelected(new Set());

    try {
      const res = await fetch(`/api/f1/import?year=${year}&type=drivers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch drivers");
      }

      setPreview(result.data);
      setMessage({ text: `${result.count} Drivers Found`, type: "success" });
    } catch (error: any) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    const selectedDrivers = preview.filter((_, i) => selected.has(i));
    if (selectedDrivers.length === 0) return;

    setLoading(true);

    try {
      const res = await fetch("/api/f1/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ drivers: selectedDrivers, type: "drivers" }),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to import drivers");
      }

      setMessage({ text: `Imported ${result.count} drivers successfully`, type: "success" });
      setPreview([]);
      setSelected(new Set());
      setYear("");
    } catch (error: any) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleImportAll = async () => {
    if (preview.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch("/api/f1/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ drivers: preview, type: "drivers" }),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to import drivers");
      }

      setMessage({ text: `Imported ${result.count} drivers successfully`, type: "success" });
      setPreview([]);
      setSelected(new Set());
      setYear("");
    } catch (error: any) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-4">Drivers Import</h2>

      <div className="flex gap-4 mb-4">
        <input
          type="number"
          placeholder="Year (e.g., 2023)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          min="1950"
          max={new Date().getFullYear()}
          className="flex-1 rounded-xl bg-black/60 border border-white/10 px-4 py-3 text-white placeholder:text-white/40"
        />
        <button
          onClick={handlePreview}
          disabled={loading || !year}
          className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Loading...
            </span>
          ) : "Fetch Preview"}
        </button>
      </div>

      {message && <Message text={message.text} type={message.type} />}

      {preview.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60">{selected.size} of {preview.length} selected</span>
            <div className="flex gap-2">
              <button onClick={() => setSelected(new Set(preview.map((_, i) => i)))} className="text-sm text-white/60 hover:text-white">
                Select All
              </button>
              <button onClick={handleImportAll} disabled={loading} className="text-sm text-green-400 hover:text-green-300 disabled:opacity-50">
                Import All
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {preview.map((driver, index) => (
              <label
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl glass-strong hover:bg-white/5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.has(index)}
                  onChange={() => {
                    const newSelected = new Set(selected);
                    if (newSelected.has(index)) newSelected.delete(index);
                    else newSelected.add(index);
                    setSelected(newSelected);
                  }}
                  className="w-4 h-4 rounded"
                />
                <div className="flex-1">
                  <div className="font-medium">{driver.name}</div>
                  <div className="text-sm text-white/50">
                    {driver.nationality} {driver.birthdate && `• Born ${driver.birthdate}`}
                  </div>
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={handleImport}
            disabled={loading || selected.size === 0}
            className="w-full px-6 py-3 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:opacity-50"
          >
            {loading ? "Importing..." : `Import ${selected.size} Selected`}
          </button>
        </div>
      )}
    </div>
  );
}

function ConstructorsImport({ token }: { token: string }) {
  const [year, setYear] = useState("");
  const [preview, setPreview] = useState<any[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handlePreview = async () => {
    setLoading(true);
    setMessage(null);
    setPreview([]);
    setSelected(new Set());

    try {
      const res = await fetch(`/api/f1/import?year=${year}&type=constructors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch constructors");
      }

      setPreview(result.data);
      setMessage({ text: `${result.count} Teams Found`, type: "success" });
    } catch (error: any) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    const selectedItems = preview.filter((_, i) => selected.has(i));
    if (selectedItems.length === 0) return;

    setLoading(true);

    try {
      const res = await fetch("/api/f1/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ constructors: selectedItems, type: "constructors" }),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to import constructors");
      }

      setMessage({ text: `Imported ${result.count} teams successfully`, type: "success" });
      setPreview([]);
      setSelected(new Set());
      setYear("");
    } catch (error: any) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleImportAll = async () => {
    if (preview.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch("/api/f1/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ constructors: preview, type: "constructors" }),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to import constructors");
      }

      setMessage({ text: `Imported ${result.count} teams successfully`, type: "success" });
      setPreview([]);
      setSelected(new Set());
      setYear("");
    } catch (error: any) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-4">Constructors Import</h2>

      <div className="flex gap-4 mb-4">
        <input
          type="number"
          placeholder="Year (e.g., 2023)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          min="1950"
          max={new Date().getFullYear()}
          className="flex-1 rounded-xl bg-black/60 border border-white/10 px-4 py-3 text-white placeholder:text-white/40"
        />
        <button
          onClick={handlePreview}
          disabled={loading || !year}
          className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Loading...
            </span>
          ) : "Fetch Preview"}
        </button>
      </div>

      {message && <Message text={message.text} type={message.type} />}

      {preview.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60">{selected.size} of {preview.length} selected</span>
            <div className="flex gap-2">
              <button onClick={() => setSelected(new Set(preview.map((_, i) => i)))} className="text-sm text-white/60 hover:text-white">
                Select All
              </button>
              <button onClick={handleImportAll} disabled={loading} className="text-sm text-green-400 hover:text-green-300 disabled:opacity-50">
                Import All
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {preview.map((constructor, index) => (
              <label
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl glass-strong hover:bg-white/5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.has(index)}
                  onChange={() => {
                    const newSelected = new Set(selected);
                    if (newSelected.has(index)) newSelected.delete(index);
                    else newSelected.add(index);
                    setSelected(newSelected);
                  }}
                  className="w-4 h-4 rounded"
                />
                <div className="flex-1">
                  <div className="font-medium">{constructor.team_name}</div>
                  <div className="text-sm text-white/50">{constructor.nationality}</div>
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={handleImport}
            disabled={loading || selected.size === 0}
            className="w-full px-6 py-3 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:opacity-50"
          >
            {loading ? "Importing..." : `Import ${selected.size} Selected`}
          </button>
        </div>
      )}
    </div>
  );
}
