import Link from "next/link";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import { listCircuits, listDrivers, listRaceResultPositions, listRaces, listSeasons } from "../../lib/queries";

export const dynamic = "force-dynamic";

export default async function RacesPage() {
  const races = await listRaces();
  const seasons = await listSeasons();
  const circuits = await listCircuits();
  const drivers = await listDrivers();
  const racePositions = await listRaceResultPositions();

  return (
    <div>
      <Navigation />
      <main className="max-w-7xl mx-auto px-8 py-16 space-y-12">
        <div>
          <h1 className="section-title red-accent pb-4">RACE RESULTS</h1>
          <p className="mt-6 text-white/70 max-w-2xl text-lg">Every race result curated manually.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {races.map((race) => {
            const season = seasons.find((s) => s.id === race.season_id);
            const circuit = circuits.find((c) => c.id === race.circuit_id);
            const p1 = racePositions.find((item) => item.race_id === race.id && item.position === 1);
            const winner = drivers.find((d) => d.id === (p1?.driver_id ?? race.winner_driver_id));
            return (
              <Link key={race.id} href={`/races/${race.id}`}>
                <Card className="hover:scale-[1.03] group">
                  <div className="text-xs uppercase tracking-widest text-f1-red mb-3 font-bold">{season?.year ?? "SEASON"}</div>
                  <h2 className="text-xl font-bold mb-6 uppercase tracking-f1 group-hover:text-f1-red transition-colors">{circuit?.circuit_name ?? "Circuit"}</h2>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                      <span className="text-white/60 uppercase tracking-wider">Winner</span>
                      <span className="font-bold text-white">{winner?.name ?? "TBD"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 uppercase tracking-wider">Laps</span>
                      <span className="font-bold text-f1-red text-xl">{race.laps ?? "—"}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer text="Every race result is curated manually." />
    </div>
  );
}
