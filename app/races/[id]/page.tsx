import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";
import { getRace, listCircuits, listDrivers, listRaceResultPositionsByRace, listSeasons, listTeams } from "../../../lib/queries";

export const dynamic = "force-dynamic";

function positionClass(position: number) {
  if (position === 1) return "text-yellow-400";
  if (position === 2) return "text-gray-300";
  if (position === 3) return "text-amber-600";
  return "text-white/85";
}

export default async function RaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const raceId = Number(id);
  const race = await getRace(raceId);
  const [seasons, circuits, drivers, teams, positions] = await Promise.all([
    listSeasons(),
    listCircuits(),
    listDrivers(),
    listTeams(),
    listRaceResultPositionsByRace(raceId),
  ]);

  if (!race) {
    return (
      <div>
        <Navigation />
        <main className="mx-auto w-full max-w-6xl px-6 py-10">
          <p className="text-f1-muted">Race not found.</p>
        </main>
      </div>
    );
  }

  const season = seasons.find((s) => s.id === race.season_id);
  const circuit = circuits.find((c) => c.id === race.circuit_id);
  const rows = [...positions].sort((a, b) => a.position - b.position);

  return (
    <div>
      <Navigation />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <section className="glass-strong rounded-2xl p-6">
          <div className="label">Race Result</div>
          <h1 className="mt-2 font-display text-3xl tracking-[0.2em]">
            {circuit?.circuit_name ?? "Race"} ({season?.year ?? "Season"})
          </h1>
          <p className="mt-2 text-sm text-f1-muted">Full classified finishing order (P1-P20 where available).</p>

          <div className="mt-6 hidden overflow-x-auto md:block">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-3 py-3 text-left text-xs uppercase tracking-[0.16em] text-white/60">Pos</th>
                  <th className="px-3 py-3 text-left text-xs uppercase tracking-[0.16em] text-white/60">Driver</th>
                  <th className="px-3 py-3 text-left text-xs uppercase tracking-[0.16em] text-white/60">Team</th>
                  <th className="px-3 py-3 text-left text-xs uppercase tracking-[0.16em] text-white/60">Laps</th>
                  <th className="px-3 py-3 text-left text-xs uppercase tracking-[0.16em] text-white/60">Time</th>
                  <th className="px-3 py-3 text-left text-xs uppercase tracking-[0.16em] text-white/60">Points</th>
                  <th className="px-3 py-3 text-left text-xs uppercase tracking-[0.16em] text-white/60">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const driver = drivers.find((d) => d.id === row.driver_id);
                  const team = teams.find((t) => t.id === row.team_id);
                  return (
                    <tr key={row.id} className="border-b border-white/5 transition-all hover:bg-white/5">
                      <td className={`px-3 py-4 text-sm font-semibold ${positionClass(row.position)}`}>P{row.position}</td>
                      <td className="px-3 py-4 text-sm text-white/90">{driver?.name ?? "—"}</td>
                      <td className="px-3 py-4 text-sm text-white/90">{team?.team_name ?? "—"}</td>
                      <td className="px-3 py-4 text-sm text-white/90">{row.laps ?? "—"}</td>
                      <td className="px-3 py-4 text-sm text-white/90">{row.time ?? "—"}</td>
                      <td className="px-3 py-4 text-sm text-white/90">{row.points}</td>
                      <td className="px-3 py-4 text-sm text-white/90">{row.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-3 md:hidden">
            {rows.map((row) => {
              const driver = drivers.find((d) => d.id === row.driver_id);
              const team = teams.find((t) => t.id === row.team_id);
              return (
                <article key={row.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold ${positionClass(row.position)}`}>P{row.position}</span>
                    <span className="text-xs uppercase tracking-[0.14em] text-white/60">{row.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-white/90">{driver?.name ?? "—"}</p>
                  <p className="text-sm text-white/70">{team?.team_name ?? "—"}</p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs uppercase tracking-[0.14em] text-white/60">
                    <div>
                      <div>Laps</div>
                      <div className="mt-1 text-sm normal-case tracking-normal text-white/90">{row.laps ?? "—"}</div>
                    </div>
                    <div>
                      <div>Time</div>
                      <div className="mt-1 text-sm normal-case tracking-normal text-white/90">{row.time ?? "—"}</div>
                    </div>
                    <div>
                      <div>Points</div>
                      <div className="mt-1 text-sm normal-case tracking-normal text-white/90">{row.points}</div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {!rows.length ? <p className="mt-6 text-sm text-f1-muted">No full results added yet. Podium-only data may exist for this race.</p> : null}
        </section>
      </main>
      <Footer text="Race result detail page." />
    </div>
  );
}
