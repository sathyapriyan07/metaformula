"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface StandingsRow {
  id: number;
  position: number;
  name: string;
  team: string;
  points: number;
  wins: number;
  image_url?: string | null;
  team_logo_url?: string | null;
  driver_id?: number;
  team_id?: number;
}

export default function StandingsTable({ rows }: { rows: StandingsRow[] }) {
  const router = useRouter();

  return (
    <section className="rounded-2xl border border-white/10 bg-black/80 p-6 shadow-glass">
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-3 py-3 text-left text-xs uppercase tracking-[0.16em] text-white/60">Pos</th>
              <th className="px-3 py-3 text-left text-xs uppercase tracking-[0.16em] text-white/60">Name</th>
              <th className="px-3 py-3 text-left text-xs uppercase tracking-[0.16em] text-white/60">Team</th>
              <th className="px-3 py-3 text-left text-xs uppercase tracking-[0.16em] text-white/60">Points</th>
              <th className="px-3 py-3 text-left text-xs uppercase tracking-[0.16em] text-white/60">Wins</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const targetId = row.driver_id || row.team_id;
              const targetPath = row.driver_id ? `/drivers/${row.driver_id}` : row.team_id ? `/teams/${row.team_id}` : null;
              
              return (
                <tr
                  key={row.id}
                  onClick={() => targetPath && router.push(targetPath)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && targetPath) router.push(targetPath);
                  }}
                  tabIndex={targetPath ? 0 : undefined}
                  role={targetPath ? "button" : undefined}
                  aria-label={targetPath ? `View ${row.name} ${row.driver_id ? 'profile' : 'team page'}` : undefined}
                  className={`group border-b border-white/5 transition-all hover:bg-white/5 focus:bg-white/5 focus:outline-none focus:ring-2 focus:ring-red-500/50 ${
                    targetPath ? "cursor-pointer" : ""
                  }`}
                >
                  <td className="px-3 py-4 text-sm text-white/90">{row.position}</td>
                  <td className="px-3 py-4 text-sm text-white/90">
                    <div className="flex items-center gap-3 pl-2">
                      {row.image_url ? (
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#111] shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                          <Image src={row.image_url} alt={row.name} fill className="object-cover object-top transition-transform duration-300 group-hover:scale-105" unoptimized />
                        </div>
                      ) : (
                        <div className="h-16 w-16 flex-shrink-0 rounded-2xl border border-white/15 bg-neutral-900" />
                      )}
                      <span className={targetPath ? "font-medium transition-colors group-hover:text-red-500" : ""}>{row.name}</span>
                    </div>
                  </td>
                <td className="px-3 py-4 text-sm text-white/90">
                  <div className="flex items-center gap-2">
                    {row.team_logo_url ? (
                      <Image src={row.team_logo_url} alt={row.team} width={80} height={22} className="h-5 w-auto max-w-[90px] object-contain" unoptimized />
                    ) : null}
                    <span>{row.team}</span>
                  </div>
                </td>
                <td className="px-3 py-4 text-sm text-white/90">{row.points}</td>
                <td className="px-3 py-4 text-sm text-white/90">{row.wins}</td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {rows.map((row) => {
          const targetId = row.driver_id || row.team_id;
          const targetPath = row.driver_id ? `/drivers/${row.driver_id}` : row.team_id ? `/teams/${row.team_id}` : null;
          
          return targetPath ? (
            <Link key={row.id} href={targetPath}>
              <article className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all hover:bg-white/5 active:scale-[0.98] [animation:fadeInUp_0.3s_ease-out_both]">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.14em] text-white/60">Pos {row.position}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/70">{row.points} pts</span>
                    <svg className="h-4 w-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  {row.image_url ? (
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#111] shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                      <Image src={row.image_url} alt={row.name} fill className="object-cover object-top transition-transform duration-300 group-hover:scale-105" unoptimized />
                    </div>
                  ) : (
                    <div className="h-12 w-12 flex-shrink-0 rounded-xl border border-white/15 bg-neutral-900" />
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white/90">{row.name}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-white/70">
                      {row.team_logo_url ? (
                        <Image src={row.team_logo_url} alt={row.team} width={60} height={16} className="h-4 w-auto object-contain" unoptimized />
                      ) : (
                        <span>{row.team}</span>
                      )}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-[0.12em] text-white/60">Wins: <span className="normal-case tracking-normal text-white/90">{row.wins}</span></div>
                  </div>
                </div>
              </article>
            </Link>
          ) : (
            <article key={row.id} className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 [animation:fadeInUp_0.3s_ease-out_both]">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.14em] text-white/60">Pos {row.position}</span>
                <span className="text-sm text-white/70">{row.points} pts</span>
              </div>
              <div className="mt-3 flex items-center gap-3">
                {row.image_url ? (
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#111] shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                    <Image src={row.image_url} alt={row.name} fill className="object-cover object-top transition-transform duration-300 group-hover:scale-105" unoptimized />
                  </div>
                ) : (
                  <div className="h-12 w-12 flex-shrink-0 rounded-xl border border-white/15 bg-neutral-900" />
                )}
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white/90">{row.name}</div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-white/70">
                    {row.team_logo_url ? (
                      <Image src={row.team_logo_url} alt={row.team} width={60} height={16} className="h-4 w-auto object-contain" unoptimized />
                    ) : (
                      <span>{row.team}</span>
                    )}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.12em] text-white/60">Wins: <span className="normal-case tracking-normal text-white/90">{row.wins}</span></div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {!rows.length ? <p className="text-sm text-white/70">No standings added for this season yet.</p> : null}
    </section>
  );
}
