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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-12">
        <h1 className="text-4xl md:text-6xl font-semibold mb-8">Race Results</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 fade-in-up">
          {races.map((race) => {
            const season = seasons.find((s) => s.id === race.season_id);
            const circuit = circuits.find((c) => c.id === race.circuit_id);
            const p1 = racePositions.find((item) => item.race_id === race.id && item.position === 1);
            const winner = drivers.find((d) => d.id === (p1?.driver_id ?? race.winner_driver_id));
            return (
              <Link key={race.id} href={`/races/${race.id}`}>
                <Card className="rounded-2xl overflow-hidden backdrop-blur-md bg-white/5 border border-white/10 shadow-xl hover:scale-105 transition-all duration-300 ease-out p-8">
                  <div className="text-xs tracking-widest uppercase text-white/60 mb-2">{season?.year ?? "Season"}</div>
                  <h2 className="text-2xl font-semibold text-white mb-4">{circuit?.circuit_name ?? "Circuit"}</h2>
                  <div className="space-y-2 text-base text-white/80">
                    <div className="flex justify-between">
                      <span>Winner</span>
                      <span className="font-semibold">{winner?.name ?? "TBD"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Laps</span>
                      <span className="font-semibold">{race.laps ?? "\u2014"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date</span>
                      <span className="font-semibold">{race.date}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
