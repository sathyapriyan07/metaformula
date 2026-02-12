import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import Card from "../components/Card";
import RemoteImage from "../components/RemoteImage";
import { Badge } from "../components/Badge";
import { listDrivers, listSeasons, listTeams } from "../lib/queries";
import { Suspense } from "react";
import { SkeletonHero, SkeletonGrid } from "../components/Skeleton";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    <div>
      <Navigation />
      <Suspense fallback={<SkeletonHero />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<div className="max-w-7xl mx-auto px-8 py-20"><SkeletonGrid count={4} /></div>}>
        <DriverSpotlight />
      </Suspense>
      <Footer text="Formula 1 Historical Database. All data curated manually." />
    </div>
  );
}

async function HeroSection() {
  const seasons = await listSeasons();
  const drivers = await listDrivers();
  const teams = await listTeams();

  const featured = seasons[0];
  const championDriver = featured ? drivers.find((d) => d.id === featured.champion_driver_id) : null;
  const championTeam = featured ? teams.find((t) => t.id === featured.champion_team_id) : null;

  return (
    <>
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <RemoteImage 
            src={featured?.banner_image_url ?? null} 
            alt="Featured season" 
            fill 
            className="object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 h-full flex flex-col justify-end pb-16">
          <Badge>Featured Season</Badge>
          <h1 className="text-5xl md:text-7xl font-bold mt-4 mb-6">
            {featured ? `${featured.year} Season` : "F1 Historical Archive"}
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mb-8">
            Curated Formula 1 archive. Every season, driver, and race meticulously documented.
          </p>
          <div className="flex gap-4">
            <a href="/seasons" className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:scale-105">
              Explore Seasons
            </a>
            <a href="/compare/drivers" className="px-8 py-3 rounded-full glass text-white hover:scale-105">
              Compare Drivers
            </a>
          </div>
        </div>
      </section>

      {featured && (
        <main className="max-w-7xl mx-auto px-8 py-20">
          <div className="glass rounded-2xl p-8 max-w-2xl">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">{championDriver?.name ?? "TBD"}</div>
                <div className="text-sm text-white/50 mt-2">Champion Driver</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{championTeam?.team_name ?? "TBD"}</div>
                <div className="text-sm text-white/50 mt-2">Champion Team</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{featured.total_races ?? 0}</div>
                <div className="text-sm text-white/50 mt-2">Total Races</div>
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
}

async function DriverSpotlight() {
  const drivers = await listDrivers();

  return (
    <main className="max-w-7xl mx-auto px-8 pb-20 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="section-title">Driver Spotlight</h2>
        <Badge>Curated</Badge>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {drivers.slice(0, 4).map((driver) => (
          <a key={driver.id} href={`/drivers/${driver.id}`} className="group">
            <Card className="overflow-hidden">
              <div className="relative aspect-[3/4] mb-4 rounded-xl overflow-hidden bg-white/5">
                <RemoteImage 
                  src={driver.profile_image_url ?? null} 
                  alt={driver.name} 
                  fill 
                  className="object-contain group-hover:scale-105" 
                />
              </div>
              <div className="text-xs text-white/50 mb-1">{driver.nationality ?? "Unknown"}</div>
              <h3 className="text-lg font-semibold">{driver.name}</h3>
            </Card>
          </a>
        ))}
      </div>
    </main>
  );
}
