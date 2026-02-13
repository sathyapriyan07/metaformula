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
        <main className="max-w-6xl mx-auto px-3 md:px-8 py-8">
          <p className="text-white/50">Driver not found.</p>
        </main>
      </div>
    );
  }

  const teamNames = (driver.team_ids ?? [])
    .map((teamId) => teams.find((t) => t.id === teamId)?.team_name)
    .filter(Boolean)
    .join(", ");

  const driverNumber = String(driver.id).padStart(2, "0");

  return (
    <div>
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-3 md:px-8 py-4 md:py-8 space-y-3">
        <div className="grid md:grid-cols-[280px_1fr] gap-3">
          {/* Driver Portrait */}
          <div className="relative p-2 rounded-xl border border-white/10 bg-[#0c0c0c]">
            <span className="absolute top-2 right-3 z-10 font-bebas text-6xl leading-none text-white opacity-10">
              {driverNumber}
            </span>
            <div className="relative h-56 md:h-72 overflow-hidden rounded-lg bg-black">
              <RemoteImage 
                src={driver.profile_image_url ?? null} 
                alt={driver.name} 
                fill 
                className="object-cover object-top" 
              />
            </div>
            <div className="h-[2px] bg-red-600 mt-2" />
          </div>

          {/* Driver Info */}
          <div className="space-y-3">
            {/* Name Card */}
            <div className="relative p-4 rounded-xl border border-white/10 bg-[#111]">
              <div className="flex items-start justify-between mb-2">
                <Badge className="text-[10px] px-2 py-1">{driver.nationality ?? "Unknown"}</Badge>
                <FavoriteButton id={driver.id} type="driver" name={driver.name} className="w-9 h-9" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight text-white mb-1">{driver.name}</h1>
              <p className="text-sm text-white/60">Born: {driver.birthdate ?? "—"}</p>
              <p className="text-sm text-white/60 mt-1">Teams: {teamNames || "Independent"}</p>
            </div>

            {/* Career Stats */}
            <div className="p-4 rounded-xl border border-white/10 bg-[#111] space-y-2">
              <h2 className="text-lg font-bold text-white mb-3">Career Stats</h2>
              <StatRow label="Championships" value={driver.championships ?? 0} />
              <StatRow label="Wins" value={driver.wins ?? 0} />
              <StatRow label="Podiums" value={driver.podiums ?? 0} />
              <StatRow label="Poles" value={driver.poles ?? 0} />
              <StatRow label="Fastest Laps" value={driver.fastest_laps ?? 0} />
            </div>

            {/* Biography */}
            {driver.biography && (
              <div className="p-4 rounded-xl border border-white/10 bg-[#111]">
                <h2 className="text-lg font-bold text-white mb-3">Biography</h2>
                <p className="text-sm text-white/70 leading-relaxed">{driver.biography}</p>
              </div>
            )}

            {/* Charts */}
            <DriverStatsChart driver={driver} />

            {/* Season Performance */}
            <SeasonPerformance stats={seasonStats} />
          </div>
        </div>
      </main>
      
      <Footer text="Curated driver profiles." />
    </div>
  );
}
