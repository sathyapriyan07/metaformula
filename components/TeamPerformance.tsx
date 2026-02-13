"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { TeamYearlyPerformance } from "../lib/queries";

function getPositionBadgeClass(position: number): string {
  if (position === 1) return "bg-gradient-to-br from-yellow-400 to-yellow-600 text-black";
  if (position === 2) return "bg-gradient-to-br from-gray-300 to-gray-400 text-black";
  if (position === 3) return "bg-gradient-to-br from-amber-600 to-amber-700 text-white";
  return "bg-neutral-800 text-white/90";
}

export default function TeamPerformance({ performance }: { performance: TeamYearlyPerformance[] }) {
  const router = useRouter();

  if (!performance.length) {
    return (
      <section className="glass rounded-2xl p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Team Performance</h2>
        <p className="text-sm text-white/60">No performance data available.</p>
      </section>
    );
  }

  return (
    <section className="glass rounded-2xl p-6">
      <h2 className="mb-6 text-xl font-bold text-white">Team Performance</h2>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-3 py-3 text-left text-xs uppercase tracking-wide text-white/70">Year</th>
              <th className="px-3 py-3 text-left text-xs uppercase tracking-wide text-white/70">Position</th>
              <th className="px-3 py-3 text-left text-xs uppercase tracking-wide text-white/70">Points</th>
              <th className="px-3 py-3 text-left text-xs uppercase tracking-wide text-white/70">Wins</th>
            </tr>
          </thead>
          <tbody>
            {performance.map((perf, idx) => (
              <tr
                key={perf.year}
                onClick={() => router.push(`/seasons/${perf.year}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") router.push(`/seasons/${perf.year}`);
                }}
                tabIndex={0}
                role="button"
                aria-label={`View ${perf.year} season`}
                className={`cursor-pointer border-b border-white/5 transition-all hover:bg-white/5 focus:bg-white/5 focus:outline-none focus:ring-2 focus:ring-red-500/50 ${
                  idx % 2 === 0 ? "bg-white/[0.02]" : ""
                }`}
              >
                <td className="px-3 py-4">
                  <span className="text-sm font-semibold tracking-wide text-white hover:text-red-500">
                    {perf.year}
                  </span>
                </td>
                <td className="px-3 py-4">
                  <span
                    className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold ${getPositionBadgeClass(
                      perf.position
                    )}`}
                  >
                    P{perf.position}
                  </span>
                </td>
                <td className="px-3 py-4 text-sm text-white/90">{perf.points}</td>
                <td className="px-3 py-4 text-sm text-white/90">{perf.wins}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {performance.map((perf) => (
          <Link key={perf.year} href={`/seasons/${perf.year}`}>
            <article className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all hover:bg-white/5 active:scale-[0.98]">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-lg font-bold text-white">{perf.year}</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-bold ${getPositionBadgeClass(
                      perf.position
                    )}`}
                  >
                    P{perf.position}
                  </span>
                  <svg className="h-4 w-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="mb-2 text-sm text-white/70">
                <span className="font-semibold text-white">{perf.points}</span> pts
              </div>
              <div className="text-xs uppercase tracking-wide text-white/60">
                Wins: <span className="font-semibold text-white/90">{perf.wins}</span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
