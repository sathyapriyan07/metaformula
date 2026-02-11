import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import Card from "../components/Card";
import RemoteImage from "../components/RemoteImage";
import { Badge } from "../components/Badge";
import { listDrivers, listSeasons, listTeams } from "../lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const seasons = await listSeasons();
  const drivers = await listDrivers();
  const teams = await listTeams();

  const featured = seasons[0];
  const championDriver = featured ? drivers.find((d) => d.id === featured.champion_driver_id) : null;
  const championTeam = featured ? teams.find((t) => t.id === featured.champion_team_id) : null;

  return (
    <div className="overflow-x-hidden w-full max-w-full">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero / Banner */}
        <section className="relative overflow-hidden rounded-2xl py-16 md:py-24 fade-in-up">
          <div className="absolute inset-0 z-0">
            <RemoteImage src={featured?.banner_image_url ?? null} alt="Featured season" fill className="w-full h-[380px] md:h-[520px] object-cover rounded-2xl" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-2xl" />
          </div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-8 md:px-16">
            <div>
              <div className="text-xs tracking-widest uppercase text-white/60 mb-2">Historical Archive</div>
              <h1 className="text-4xl md:text-6xl font-semibold mb-6 drop-shadow-xl">{featured ? `${featured.year} Season` : "F1 Historical Archive"}</h1>
              <p className="text-lg text-white/70 max-w-xl mb-8">An IMDb-style Formula 1 archive. Every season, driver, constructor, circuit, and race result is curated manually by administrators. No live feeds, no external APIs.</p>
              <div className="flex gap-4 flex-wrap">
                <a href="/seasons" className="px-6 py-3 rounded-full bg-cyan-500/80 hover:bg-cyan-500 text-white font-medium transition-all duration-300 ease-out shadow-xl">Explore Seasons</a>
                <a href="/compare/drivers" className="px-6 py-3 rounded-full border border-white/20 bg-white/10 backdrop-blur text-white/90 font-medium hover:bg-white/20 transition-all duration-300 ease-out">Compare Drivers</a>
              </div>
            </div>
            <div className="glass backdrop-blur-md bg-white/5 border border-white/10 shadow-xl rounded-2xl p-8 self-end fade-in-up">
              <div className="space-y-4 text-base text-white/80">
                <div className="flex justify-between">
                  <span>Champion Driver</span>
                  <span className="text-white font-semibold">{championDriver?.name ?? "TBD"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Champion Team</span>
                  <span className="text-white font-semibold">{championTeam?.team_name ?? "TBD"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Races</span>
                  <span className="text-white font-semibold">{featured?.total_races ?? 0}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Driver Spotlight */}
        <section className="py-16 md:py-24 space-y-8 fade-in-up">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-wide">Driver Spotlight</h2>
            <Badge>Curated</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            {drivers.slice(0, 4).map((driver) => (
              <Card key={driver.id} className="rounded-2xl overflow-hidden backdrop-blur-md bg-white/5 border border-white/10 shadow-xl hover:scale-105 transition-all duration-300 ease-out">
                <div className="relative h-48 overflow-hidden rounded-2xl">
                  <RemoteImage src={driver.profile_image_url ?? null} alt={driver.name} fill className="object-contain w-full h-full" />
                </div>
                <div className="mt-6">
                  <div className="text-xs tracking-widest uppercase text-white/60">{driver.nationality ?? "Unknown"}</div>
                  <h3 className="mt-2 text-lg font-semibold text-white/90">{driver.name}</h3>
                </div>
              </Card>
            ))}
            {!drivers.length && <div className="text-base text-white/60">No drivers added yet.</div>}
          </div>
        </section>
      </main>
      <Footer text="Formula 1 Historical Database. All data is curated manually via the CMS." />
    </div>
  );
}
