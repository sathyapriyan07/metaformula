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
          <h1 className="section-title red-accent pb-4">SEASONS</h1>
          <p className="mt-6 text-white/70 max-w-2xl text-lg">Browse every archived Formula 1 season.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seasons.map((season) => {
            const champion = drivers.find((driver) => driver.id === season.champion_driver_id);
            const team = teams.find((t) => t.id === season.champion_team_id);
            return (
              <Link key={season.id} href={`/seasons/${season.id}`}>
                <Card className="hover:scale-[1.03] group">
                  <div className="text-xs uppercase tracking-widest text-f1-red mb-4 font-bold">SEASON</div>
                  <h2 className="text-6xl font-black mb-8 group-hover:text-f1-red transition-colors">{season.year}</h2>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                      <span className="text-white/60 uppercase tracking-wider">Champion</span>
                      <span className="font-bold text-white">{champion?.name ?? "TBD"}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                      <span className="text-white/60 uppercase tracking-wider">Constructor</span>
                      <span className="font-bold text-white">{team?.team_name ?? "TBD"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 uppercase tracking-wider">Total Races</span>
                      <span className="font-bold text-f1-red text-xl">{season.total_races}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
        
        {!seasons.length && (
          <div className="f1-panel rounded-lg p-12 text-center text-white/50">
            No seasons available yet.
          </div>
        )}
      </main>
      <Footer text="Browse every archived Formula 1 season." />
    </div>
  );
}
