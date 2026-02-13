"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "../../../lib/supabase/client";
import { LoadingSkeleton } from "../../../components/ImportStatusBanner";

type MessageType = "success" | "error";
type Message = { text: string; type: MessageType };

type StreamEvent =
  | { type: "log"; message: string }
  | { type: "error"; message: string; details?: string; code?: string }
  | { type: "complete"; message: string };

const MessageBanner = ({ text, type }: { text: string; type: MessageType }) => (
  <div
    className={`mb-4 rounded-xl border p-4 ${
      type === "success"
        ? "border-green-500/20 bg-green-500/10 text-green-400"
        : "border-red-500/20 bg-red-500/10 text-red-400"
    }`}
  >
    {text}
  </div>
);

const ButtonSpinner = () => (
  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 3.04 1.13 5.82 3 7.94l3-2.65z"
    />
  </svg>
);

function toErrorText(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Request failed";
}

function normalizeEvent(input: unknown): StreamEvent | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const event = input as Record<string, unknown>;
  const type = event.type;
  const message = event.message;

  if (type === "log" && typeof message === "string") {
    return { type: "log", message };
  }

  if (type === "complete" && typeof message === "string") {
    return { type: "complete", message };
  }

  if (type === "error" && typeof message === "string") {
    return {
      type: "error",
      message,
      details: typeof event.details === "string" ? event.details : undefined,
      code: typeof event.code === "string" ? event.code : undefined,
    };
  }

  return null;
}

async function parseErrorResponse(res: Response): Promise<string> {
  try {
    const payload = await res.json();
    if (payload && typeof payload === "object") {
      if (typeof payload.error === "string") {
        return payload.error;
      }

      if (typeof payload.message === "string") {
        return payload.message;
      }
    }
  } catch {
    // Ignore JSON parse errors.
  }

  return `Request failed (${res.status})`;
}

async function consumeImportStream(
  res: Response,
  onLog: (message: string) => void
): Promise<{ ok: boolean; message: string }> {
  if (!res.body) {
    return { ok: false, message: "No response stream from import API" };
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";
  let completedMessage: string | null = null;
  let errorMessage: string | null = null;

  const processBuffer = () => {
    let boundary = buffer.indexOf("\n\n");

    while (boundary !== -1) {
      const eventBlock = buffer.slice(0, boundary).trim();
      buffer = buffer.slice(boundary + 2);

      const dataLine = eventBlock
        .split("\n")
        .map((line) => line.trim())
        .find((line) => line.startsWith("data: "));

      if (dataLine) {
        const payload = dataLine.slice(6);
        try {
          const event = normalizeEvent(JSON.parse(payload));
          if (event?.type === "log") {
            onLog(event.message);
          }

          if (event?.type === "error") {
            const details = event.details ? `: ${event.details}` : "";
            onLog(`${event.message}${details}`);
            errorMessage = `${event.message}${details}`;
          }

          if (event?.type === "complete") {
            onLog(event.message);
            completedMessage = event.message;
          }
        } catch {
          onLog("Received malformed event payload");
          errorMessage = "Malformed import event received";
        }
      }

      boundary = buffer.indexOf("\n\n");
    }
  };

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    processBuffer();
  }

  buffer += decoder.decode();
  processBuffer();

  if (errorMessage) {
    return { ok: false, message: errorMessage };
  }

  if (completedMessage) {
    return { ok: true, message: completedMessage };
  }

  return { ok: false, message: "Import ended without a completion signal" };
}

function ProgressLog({ progress }: { progress: string[] }) {
  if (progress.length === 0) {
    return null;
  }

  return (
    <div className="glass-strong max-h-96 overflow-y-auto rounded-xl p-4">
      <div className="mb-2 text-xs text-white/60">Progress Log</div>
      <div className="space-y-1 font-mono text-xs">
        {progress.map((msg, i) => (
          <div key={`${msg}-${i}`} className="text-white/80">
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function F1ImportPage() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowser();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setToken(session?.access_token || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setToken(session?.access_token || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!token) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div className="glass rounded-2xl p-8">
        <h1 className="mb-2 text-3xl font-bold">F1 Data Import Tool</h1>
        <p className="text-white/60">Import historical F1 data from multiple providers.</p>
        <div className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">
          <p className="text-sm text-yellow-400">Admin only: choose a source and run the import.</p>
          <a
            href="/admin/verify-role"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-xs text-yellow-300 underline hover:text-yellow-200"
          >
            Debug role endpoint
          </a>
        </div>
      </div>

      <F1DBBulkImport token={token} />
      <ErgastBulkImport token={token} />
    </div>
  );
}

function F1DBBulkImport({ token }: { token: string }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);
  const [message, setMessage] = useState<Message | null>(null);

  const handleImport = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    setProgress([]);
    setMessage(null);

    try {
      const res = await fetch("/api/f1db/bulk-import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setMessage({ text: await parseErrorResponse(res), type: "error" });
        return;
      }

      const outcome = await consumeImportStream(res, (entry) => {
        setProgress((prev) => [...prev, entry]);
      });

      if (outcome.ok) {
        setMessage({ text: outcome.message, type: "success" });
      } else {
        setMessage({ text: outcome.message, type: "error" });
      }
    } catch (error) {
      setMessage({ text: toErrorText(error), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl border-2 border-green-500/30 p-6">
      <h2 className="mb-2 text-2xl font-bold text-green-400">F1DB Import (Recommended)</h2>
      <p className="mb-4 text-white/60">
        Import comprehensive F1 data from{" "}
        <a
          href="https://github.com/f1db/f1db"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-400 underline hover:text-green-300"
        >
          F1DB
        </a>{" "}
        (CC BY 4.0).
      </p>
      <p className="mb-6 text-xs text-white/50">Imports circuits, constructors, drivers, and seasons.</p>

      <button
        onClick={handleImport}
        disabled={loading}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-green-500/30 bg-green-500/20 px-6 py-4 font-bold text-green-400 hover:bg-green-500/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading && <ButtonSpinner />}
        {loading ? "Importing..." : "Import F1DB Data"}
      </button>

      {message && <MessageBanner text={message.text} type={message.type} />}
      <ProgressLog progress={progress} />
    </div>
  );
}

function ErgastBulkImport({ token }: { token: string }) {
  const [startYear, setStartYear] = useState("2020");
  const [endYear, setEndYear] = useState("2024");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);
  const [message, setMessage] = useState<Message | null>(null);

  const handleBulkImport = async () => {
    if (loading) {
      return;
    }

    const start = Number.parseInt(startYear, 10);
    const end = Number.parseInt(endYear, 10);

    if (Number.isNaN(start) || Number.isNaN(end) || start > end || start < 1950 || end > new Date().getFullYear()) {
      setMessage({ text: "Invalid year range", type: "error" });
      return;
    }

    setLoading(true);
    setProgress([]);
    setMessage(null);

    try {
      const res = await fetch("/api/ergast/bulk-import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ startYear: start, endYear: end }),
      });

      if (!res.ok) {
        setMessage({ text: await parseErrorResponse(res), type: "error" });
        return;
      }

      const outcome = await consumeImportStream(res, (entry) => {
        setProgress((prev) => [...prev, entry]);
      });

      if (outcome.ok) {
        setMessage({ text: outcome.message, type: "success" });
      } else {
        setMessage({ text: outcome.message, type: "error" });
      }
    } catch (error) {
      setMessage({ text: toErrorText(error), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl border-2 border-f1-red/30 p-6">
      <h2 className="mb-2 text-2xl font-bold text-f1-red">Ergast API Import</h2>
      <p className="mb-6 text-white/60">Import data by year range from Ergast API.</p>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-xs text-white/60">Start Year</label>
          <input
            type="number"
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
            min="1950"
            max={new Date().getFullYear()}
            className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-white"
          />
        </div>
        <div>
          <label className="mb-2 block text-xs text-white/60">End Year</label>
          <input
            type="number"
            value={endYear}
            onChange={(e) => setEndYear(e.target.value)}
            min="1950"
            max={new Date().getFullYear()}
            className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-white"
          />
        </div>
      </div>

      <button
        onClick={handleBulkImport}
        disabled={loading}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-f1-red px-6 py-4 font-bold text-white hover:bg-f1-red-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading && <ButtonSpinner />}
        {loading ? "Importing..." : `Import Years ${startYear}-${endYear}`}
      </button>

      {message && <MessageBanner text={message.text} type={message.type} />}
      <ProgressLog progress={progress} />
    </div>
  );
}
