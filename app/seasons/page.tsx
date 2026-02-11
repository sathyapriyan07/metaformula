import Link from "next/link";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import { listDrivers, listSeasons, listTeams } from "../../lib/queries";

export const dynamic = "force-dynamic";

export default async function SeasonsPage() {
  const seasons = await listSeasons();
  const drivers = await listDrivers();
  const teams = await listTeams();

  return (
    <div>
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-12">
        <h1 className="text-4xl md:text-6xl font-semibold mb-8">Seasons Archive</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 fade-in-up">
          {seasons.map((season) => {
            const champion = drivers.find((driver) => driver.id === season.champion_driver_id);
            const team = teams.find((t) => t.id === season.champion_team_id);
            return (
              <Link key={season.id} href={`/seasons/${season.id}`}>
                <Card className="rounded-2xl overflow-hidden backdrop-blur-md bg-white/5 border border-white/10 shadow-xl hover:scale-105 transition-all duration-300 ease-out p-8">
                  <div className="text-xs tracking-widest uppercase text-white/60 mb-2">Season</div>
                  <h2 className="text-2xl font-semibold text-white mb-4">{season.year}</h2>
                  <div className="space-y-2 text-base text-white/80">
                    <div className="flex justify-between">
                      <span>Champion</span>
                      <span className="font-semibold">{champion?.name ?? "TBD"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Constructor</span>
                      <span className="font-semibold">{team?.team_name ?? "TBD"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Races</span>
                      <span className="font-semibold">{season.total_races}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
          {!seasons.length && <div className="text-sm text-f1-muted">No seasons available yet.</div>}
        </div>
      </main>
      <Footer text="Browse every archived Formula 1 season." />
    </div>
  );
}
