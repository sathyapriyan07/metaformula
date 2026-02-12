interface ImportStatusBannerProps {
  status: "loading" | "cached" | "error" | "success";
  message?: string;
  onRetry?: () => void;
}

export default function ImportStatusBanner({ status, message, onRetry }: ImportStatusBannerProps) {
  if (status === "loading") {
    return (
      <div className="glass rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-4">
          <svg className="animate-spin h-5 w-5 text-white/60" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <div>
            <div className="text-white/80 font-medium">Fetching season data…</div>
            <div className="text-white/50 text-sm">Connecting to providers</div>
          </div>
        </div>
        <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-white/20 rounded-full animate-pulse" style={{ width: "60%" }} />
        </div>
      </div>
    );
  }

  if (status === "cached") {
    return (
      <div className="glass rounded-2xl p-4 bg-yellow-500/5 border border-yellow-500/20">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-yellow-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <div className="text-yellow-400 font-medium text-sm">Live provider unavailable</div>
            <div className="text-yellow-400/70 text-sm">Showing last saved data</div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="glass rounded-2xl p-4 border border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-white/60 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className="text-white/80 font-medium text-sm">Data provider busy</div>
              <div className="text-white/50 text-sm">{message || "Please retry in a moment"}</div>
            </div>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  if (status === "success" && message) {
    return (
      <div className="glass rounded-2xl p-4 bg-green-500/5 border border-green-500/20">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div className="text-green-400 text-sm font-medium">{message}</div>
        </div>
      </div>
    );
  }

  return null;
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="glass rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-white/5 rounded w-1/3" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
