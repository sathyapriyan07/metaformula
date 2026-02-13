"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CircuitRaceHistory } from "../lib/queries";

export default function CircuitHistory({ history }: { history: CircuitRaceHistory[] }) {
  const router = useRouter();

  if (!history.length) {
    return (
      <section className="rounded-2xl border border-white/10 bg-[#111] p-6 mt-6">
        <h2 className="mb-4 text-xl font-bold text-white">Circuit History</h2>
        <p className="text-sm text-white/60">No race history available.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-[#111] p-5 mt-6">
      <h2 className="mb-5 text-xl font-bold text-white">Circuit History</h2>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-3 py-3 text-left text-xs uppercase tracking-wide text-white/70">Year</th>
              <th className="px-3 py-3 text-left text-xs uppercase tracking-wide text-white/70">Grand Prix</th>
              <th className="px-3 py-3 text-left text-xs uppercase tracking-wide text-white/70">Winner</th>
              <th className="px-3 py-3 text-left text-xs uppercase tracking-wide text-white/70">Team</th>
            </tr>
          </thead>
          <tbody>
            {history.map((race, idx) => (
              <tr
                key={`${race.year}-${idx}`}
                onClick={() => router.push(`/seasons/${race.year}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") router.push(`/seasons/${race.year}`);
                }}
                tabIndex={0}
                role="button"
                aria-label={`View ${race.year} season`}
                className="cursor-pointer border-b border-white/5 transition-all hover:bg-white/5 focus:bg-white/5 focus:outline-none focus:ring-2 focus:ring-red-500/50"
              >
                <td className="px-3 py-4">
                  <span className="text-sm font-semibold tracking-wide text-white hover:text-red-500">
                    {race.year}
                  </span>
                </td>
                <td className="px-3 py-4 text-sm text-white/90">{race.raceName}</td>
                <td className="px-3 py-4 text-sm text-white/90">
                  {race.driverId ? (
                    <Link
                      href={`/drivers/${race.driverId}`}
                      className="flex items-center gap-2 hover:text-red-500"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {race.winnerImage && (
                        <Image
                          src={race.winnerImage}
                          alt={race.winnerName || "Winner"}
                          width={24}
                          height={24}
                          className="h-6 w-6 rounded-full object-cover"
                          unoptimized
                        />
                      )}
                      <span>{race.winnerName || "—"}</span>
                    </Link>
                  ) : (
                    <span>{race.winnerName || "—"}</span>
                  )}
                </td>
                <td className="px-3 py-4 text-sm text-white/90">
                  {race.teamId ? (
                    <Link
                      href={`/teams/${race.teamId}`}
                      className="flex items-center gap-2 hover:text-red-500"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {race.teamLogo && (
                        <Image
                          src={race.teamLogo}
                          alt={race.teamName || "Team"}
                          width={60}
                          height={16}
                          className="h-4 w-auto object-contain"
                          unoptimized
                        />
                      )}
                      <span>{race.teamName || "—"}</span>
                    </Link>
                  ) : (
                    <span>{race.teamName || "—"}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {history.map((race, idx) => (
          <Link key={`${race.year}-${idx}`} href={`/seasons/${race.year}`}>
            <article className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all hover:bg-white/5 active:scale-[0.98]">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-lg font-bold text-white">{race.year}</span>
                <svg className="h-4 w-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="mb-2 text-sm text-white/70">{race.raceName}</p>
              {race.winnerName && (
                <div className="text-xs text-white/60">
                  Winner: <span className="font-semibold text-white/90">{race.winnerName}</span>
                </div>
              )}
              {race.teamName && (
                <div className="text-xs text-white/60">
                  Team: <span className="font-semibold text-white/90">{race.teamName}</span>
                </div>
              )}
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
