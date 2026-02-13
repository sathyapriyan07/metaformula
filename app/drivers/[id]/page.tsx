import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";
import RemoteImage from "../../../components/RemoteImage";
import { Badge } from "../../../components/Badge";
import { StatRow } from "../../../components/StatRow";
import FavoriteButton from "../../../components/FavoriteButton";
import { DriverStatsChart } from "../../../components/Charts";
import SeasonPerformance from "../../../components/SeasonPerformance";
import { getDriver, listTeams, getDriverSeasonStats } from "../../../lib/queries";

export const dynamic = "force-dynamic";

export default async function DriverDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const driver = await getDriver(Number(id));
  const teams = await listTeams();
  const seasonStats = await getDriverSeasonStats(Number(id));

  if (!driver) {
    return (
      <div>
        <Navigation />
        <main className="max-w-6xl mx-auto px-8 py-16">
          <p className="text-white/50">Driver not found.</p>
        </main>
      </div>
    );
  }

  const teamNames = (driver.team_ids ?? [])
    .map((teamId) => teams.find((t) => t.id === teamId)?.team_name)
    .filter(Boolean)
    .join(", ");

  return (
    <div>
      <Navigation />
      
      <section className="relative h-[50vh] overflow-hidden">
        <div className="absolute inset-0">
          <RemoteImage 
            src={driver.profile_image_url ?? null} 
            alt={driver.name} 
            fill 
            className="object-cover blur-2xl opacity-30" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-8 -mt-32 relative z-10 pb-20">
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          <div className="glass rounded-2xl overflow-hidden aspect-[3/4]">
            <RemoteImage 
              src={driver.profile_image_url ?? null} 
              alt={driver.name} 
              fill 
              className="object-contain" 
            />
          </div>

          <div className="space-y-6">
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center justify-between mb-4">
                <Badge>{driver.nationality ?? "Unknown"}</Badge>
                <FavoriteButton id={driver.id} type="driver" name={driver.name} />
              </div>
              <h1 className="text-5xl font-bold mt-4 mb-2">{driver.name}</h1>
              <p className="text-white/50 mb-6">Born: {driver.birthdate ?? "—"}</p>
              <p className="text-white/60">Teams: {teamNames || "Independent"}</p>
            </div>

            <div className="glass rounded-2xl p-8 space-y-4">
              <h2 className="text-xl font-bold mb-4">Career Stats</h2>
              <StatRow label="Championships" value={driver.championships ?? 0} />
              <StatRow label="Wins" value={driver.wins ?? 0} />
              <StatRow label="Podiums" value={driver.podiums ?? 0} />
              <StatRow label="Poles" value={driver.poles ?? 0} />
              <StatRow label="Fastest Laps" value={driver.fastest_laps ?? 0} />
            </div>

            {driver.biography && (
              <div className="glass rounded-2xl p-8">
                <h2 className="text-xl font-bold mb-4">Biography</h2>
                <p className="text-white/70 leading-relaxed">{driver.biography}</p>
              </div>
            )}

            <DriverStatsChart driver={driver} />

            <SeasonPerformance stats={seasonStats} />
          </div>
        </div>
      </main>
      
      <Footer text="Curated driver profiles." />
    </div>
  );
}
