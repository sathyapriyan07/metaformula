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
      <main className="max-w-7xl mx-auto px-8 py-16 space-y-12">
        <div>
          <h1 className="section-title">Seasons</h1>
          <p className="mt-4 text-white/60 max-w-2xl">Browse every archived Formula 1 season.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seasons.map((season) => {
            const champion = drivers.find((driver) => driver.id === season.champion_driver_id);
            const team = teams.find((t) => t.id === season.champion_team_id);
            return (
              <Link key={season.id} href={`/seasons/${season.id}`}>
                <Card className="hover:scale-105">
                  <div className="text-xs text-white/50 mb-2">Season</div>
                  <h2 className="text-4xl font-bold mb-6">{season.year}</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Champion</span>
                      <span className="font-medium">{champion?.name ?? "TBD"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Constructor</span>
                      <span className="font-medium">{team?.team_name ?? "TBD"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Total Races</span>
                      <span className="font-medium">{season.total_races}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
        
        {!seasons.length && (
          <div className="glass rounded-2xl p-8 text-center text-white/50">
            No seasons available yet.
          </div>
        )}
      </main>
      <Footer text="Browse every archived Formula 1 season." />
    </div>
  );
}
