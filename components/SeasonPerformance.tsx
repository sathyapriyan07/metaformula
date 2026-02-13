"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { DriverSeasonStats } from "../lib/queries";

interface SeasonPerformanceProps {
  stats: DriverSeasonStats[];
}

function getPositionBadgeClass(position: number): string {
  if (position === 1) return "bg-gradient-to-br from-yellow-400 to-yellow-600 text-black";
  if (position === 2) return "bg-gradient-to-br from-gray-300 to-gray-400 text-black";
  if (position === 3) return "bg-gradient-to-br from-amber-600 to-amber-700 text-white";
  return "bg-neutral-800 text-white/90";
}

export default function SeasonPerformance({ stats }: SeasonPerformanceProps) {
  const router = useRouter();

  if (!stats.length) {
    return (
      <section className="rounded-2xl border border-white/10 bg-[#111] p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Season Performance</h2>
        <p className="text-sm text-white/60">No season data available.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-[#111] p-5 shadow-glass">
      <h2 className="mb-5 text-xl font-bold text-white">Season Performance</h2>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full">
          <thead className="sticky top-0 bg-[#111]">
            <tr className="border-b border-white/10">
              <th className="px-3 py-3 text-left text-xs uppercase tracking-wide text-white/70">Year</th>
              <th className="px-3 py-3 text-left text-xs uppercase tracking-wide text-white/70">Position</th>
              <th className="px-3 py-3 text-left text-xs uppercase tracking-wide text-white/70">Points</th>
              <th className="px-3 py-3 text-left text-xs uppercase tracking-wide text-white/70">Wins</th>
              <th className="px-3 py-3 text-left text-xs uppercase tracking-wide text-white/70">Podiums</th>
              <th className="px-3 py-3 text-left text-xs uppercase tracking-wide text-white/70">Poles</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((stat, idx) => (
              <tr
                key={stat.year}
                onClick={() => router.push(`/season/${stat.year}/standings`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") router.push(`/season/${stat.year}/standings`);
                }}
                tabIndex={0}
                className={`cursor-pointer border-b border-white/5 transition-all hover:bg-white/5 focus:bg-white/5 focus:outline-none focus:ring-2 focus:ring-red-500/50 ${
                  idx % 2 === 0 ? "bg-white/[0.02]" : ""
                }`}
              >
                <td className="px-3 py-4">
                  <Link
                    href={`/season/${stat.year}/standings`}
                    className="text-sm font-semibold tracking-wide text-white hover:text-red-500 focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {stat.year}
                  </Link>
                </td>
                <td className="px-3 py-4">
                  <span
                    className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold ${getPositionBadgeClass(
                      stat.position
                    )}`}
                  >
                    P{stat.position}
                  </span>
                </td>
                <td className="px-3 py-4 text-sm text-white/90">{stat.points}</td>
                <td className="px-3 py-4 text-sm text-white/90">{stat.wins}</td>
                <td className="px-3 py-4 text-sm text-white/90">{stat.podiums}</td>
                <td className="px-3 py-4 text-sm text-white/90">{stat.poles}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {stats.map((stat) => (
          <Link key={stat.year} href={`/season/${stat.year}/standings`}>
            <article className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all hover:bg-white/5 active:scale-[0.98] [animation:fadeInUp_0.3s_ease-out_both]">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-lg font-bold text-white">{stat.year}</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-bold ${getPositionBadgeClass(
                      stat.position
                    )}`}
                  >
                    P{stat.position}
                  </span>
                  <svg className="h-5 w-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="mb-2 text-sm text-white/70">
                <span className="font-semibold text-white">{stat.points}</span> pts
              </div>
              <div className="flex items-center gap-4 text-xs uppercase tracking-wide text-white/60">
                <span>
                  Wins: <span className="font-semibold text-white/90">{stat.wins}</span>
                </span>
                <span>|</span>
                <span>
                  Podiums: <span className="font-semibold text-white/90">{stat.podiums}</span>
                </span>
                <span>|</span>
                <span>
                  Poles: <span className="font-semibold text-white/90">{stat.poles}</span>
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
