"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";
import type { SeasonRaceRow } from "../../../lib/queries";

const FLAG_CODES: Record<string, string> = {
  Australia: "au",
  Bahrain: "bh",
  Saudi: "sa",
  Italy: "it",
  Monaco: "mc",
  Spain: "es",
  Canada: "ca",
  Austria: "at",
  United: "us",
  Brazil: "br",
  Mexico: "mx",
  Qatar: "qa",
  Japan: "jp",
  China: "cn",
  France: "fr",
  Belgium: "be",
  Netherlands: "nl",
  Hungary: "hu",
  Singapore: "sg",
  Azerbaijan: "az",
  Abu: "ae",
  UK: "gb",
  Britain: "gb",
  Portugal: "pt",
  Germany: "de",
};

function flagCodeFromCountry(country?: string | null) {
  if (!country) return null;
  const exact = FLAG_CODES[country];
  if (exact) return exact;
  const key = Object.keys(FLAG_CODES).find((item) => country.includes(item));
  return key ? FLAG_CODES[key] : null;
}

interface SeasonDetailClientProps {
  seasonId: number;
  seasonYear: number;
  rows: SeasonRaceRow[];
}

export default function SeasonDetailClient({ seasonId, seasonYear, rows }: SeasonDetailClientProps) {
  const router = useRouter();

  return (
    <div>
      <Navigation />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <h1 className="mb-2 font-display text-4xl tracking-[0.2em]">{seasonYear}</h1>
        <div className="mb-4 flex flex-wrap gap-3">
          <Link
            href={`/season/${seasonYear}/standings`}
            className="rounded-full border border-f1-cyan/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-f1-cyan"
          >
            View Standings
          </Link>
          <Link
            href={`/season/${seasonYear}/statistics`}
            className="rounded-full border border-f1-red/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-f1-red"
          >
            View Statistics
          </Link>
        </div>
        <h2 className="mb-6 font-sans text-xl font-bold uppercase tracking-[0.2em] text-white/95">{seasonYear} Race Results</h2>

        <section className="rounded-2xl border border-white/10 bg-black/80 p-6 shadow-glass">
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-3 py-3 text-left text-xs uppercase tracking-[0.16em] text-white/60">Grand Prix</th>
                  <th className="px-3 py-3 text-left text-xs uppercase tracking-[0.16em] text-white/60">Date</th>
                  <th className="px-3 py-3 text-left text-xs uppercase tracking-[0.16em] text-white/60">Winner</th>
                  <th className="px-3 py-3 text-left text-xs uppercase tracking-[0.16em] text-white/60">Team</th>
                  <th className="px-3 py-3 text-left text-xs uppercase tracking-[0.16em] text-white/60">Laps</th>
                  <th className="px-3 py-3 text-left text-xs uppercase tracking-[0.16em] text-white/60">Time</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const flagCode = flagCodeFromCountry(row.country);
                  return (
                    <tr
                      key={row.raceId}
                      onClick={() => router.push(`/circuits/${row.circuitId}`)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") router.push(`/circuits/${row.circuitId}`);
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`View ${row.circuitName} circuit details`}
                      className="cursor-pointer border-b border-white/5 transition-all hover:bg-white/5 focus:bg-white/5 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    >
                      <td className="px-3 py-4 text-sm text-white/90">
                        <div className="flex items-center gap-2">
                          {flagCode ? (
                            <Image
                              src={`https://flagcdn.com/w40/${flagCode}.png`}
                              alt={`${row.country} flag`}
                              width={20}
                              height={15}
                              className="h-[15px] w-5 object-cover"
                            />
                          ) : (
                            <span className="inline-block w-5 text-center text-sm">??</span>
                          )}
                          <span className="font-medium hover:text-red-500">{row.circuitName}</span>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-white/90">{row.date || "TBD"}</td>
                      <td className="px-3 py-4 text-sm text-white/90">
                        <div className="flex items-center gap-2">
                          {row.winnerImage ? (
                            <Image
                              src={row.winnerImage}
                              alt={row.winnerName || "Winner"}
                              width={28}
                              height={28}
                              className="h-7 w-7 rounded-full object-cover"
                            />
                          ) : (
                            <span className="h-7 w-7 rounded-full bg-white/10" />
                          )}
                          <span>{row.winnerName || "No result"}</span>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-white/90">
                        <div className="flex items-center gap-2">
                          {row.teamLogo ? (
                            <Image
                              src={row.teamLogo}
                              alt={row.teamName || "Team"}
                              width={80}
                              height={24}
                              className="h-6 w-auto max-w-[96px] object-contain"
                            />
                          ) : null}
                          <span>{row.teamName || "—"}</span>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-white/90">{row.laps || "—"}</td>
                      <td className="px-3 py-4 text-sm text-white/90">{row.time || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {rows.map((row) => {
              const flagCode = flagCodeFromCountry(row.country);
              return (
                <Link key={row.raceId} href={`/circuits/${row.circuitId}`}>
                  <article className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all hover:bg-white/5 active:scale-[0.98]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-white/90">
                        {flagCode ? (
                          <Image
                            src={`https://flagcdn.com/w40/${flagCode}.png`}
                            alt={`${row.country} flag`}
                            width={20}
                            height={15}
                            className="h-[15px] w-5 object-cover"
                          />
                        ) : (
                          <span className="inline-block w-5 text-center text-sm">??</span>
                        )}
                        <span className="font-medium">{row.circuitName}</span>
                      </div>
                      <svg className="h-5 w-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-sm text-white/90">
                        {row.winnerImage ? (
                          <Image src={row.winnerImage} alt={row.winnerName || "Winner"} width={24} height={24} className="h-6 w-6 rounded-full object-cover" />
                        ) : (
                          <span className="h-6 w-6 rounded-full bg-white/10" />
                        )}
                        <span>{row.winnerName || "No result"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/90">
                        {row.teamLogo ? (
                          <Image src={row.teamLogo} alt={row.teamName || "Team"} width={80} height={20} className="h-5 w-auto max-w-[88px] object-contain" />
                        ) : null}
                        <span>{row.teamName || "—"}</span>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs uppercase tracking-[0.14em] text-white/60">
                      <div>
                        <div>Date</div>
                        <div className="mt-1 text-sm text-white/90 normal-case tracking-normal">{row.date || "TBD"}</div>
                      </div>
                      <div>
                        <div>Laps</div>
                        <div className="mt-1 text-sm text-white/90 normal-case tracking-normal">{row.laps || "—"}</div>
                      </div>
                      <div>
                        <div>Time</div>
                        <div className="mt-1 text-sm text-white/90 normal-case tracking-normal">{row.time || "—"}</div>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>

          {!rows.length && <p className="text-sm text-white/70">No race results available for this season.</p>}
        </section>
      </main>
      <Footer text="Season race results archive." />
    </div>
  );
}
