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
      <section className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <RemoteImage 
            src={featured?.banner_image_url ?? null} 
            alt="Featured season" 
            fill 
            className="object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 h-full flex flex-col justify-end pb-20">
          <Badge variant="red">FEATURED SEASON</Badge>
          <h1 className="text-6xl md:text-8xl font-black mt-6 mb-6 uppercase tracking-tight">
            {featured ? `${featured.year}` : "F1 ARCHIVE"}
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mb-10 leading-relaxed">
            The complete Formula 1 historical archive. Every season, driver, and race meticulously documented.
          </p>
          <div className="flex gap-4">
            <a href="/seasons" className="px-8 py-4 bg-f1-red hover:bg-f1-red-hover text-white font-bold uppercase tracking-wider text-sm transition-all">
              Explore Seasons
            </a>
            <a href="/compare/drivers" className="px-8 py-4 border-2 border-white/20 hover:border-f1-red text-white font-bold uppercase tracking-wider text-sm transition-all">
              Compare Drivers
            </a>
          </div>
        </div>
      </section>

      {featured && (
        <main className="max-w-7xl mx-auto px-8 py-16">
          <div className="f1-panel rounded-lg p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="text-center md:text-left">
                <div className="text-xs uppercase tracking-widest text-f1-red mb-3 font-bold">CHAMPION DRIVER</div>
                <div className="f1-stat text-white">{championDriver?.name ?? "TBD"}</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-xs uppercase tracking-widest text-f1-red mb-3 font-bold">CHAMPION TEAM</div>
                <div className="f1-stat text-white">{championTeam?.team_name ?? "TBD"}</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-xs uppercase tracking-widest text-f1-red mb-3 font-bold">TOTAL RACES</div>
                <div className="f1-stat text-white">{featured.total_races ?? 0}</div>
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
    <main className="max-w-7xl mx-auto px-8 pb-20 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title red-accent pb-4">DRIVER SPOTLIGHT</h2>
        </div>
        <Badge>CURATED</Badge>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {drivers.slice(0, 4).map((driver) => (
          <a key={driver.id} href={`/drivers/${driver.id}`} className="group">
            <div className="relative f1-panel-hover rounded-lg overflow-hidden aspect-[3/4]">
              <RemoteImage 
                src={driver.profile_image_url ?? null} 
                alt={driver.name} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="text-xs text-white/60 mb-1 uppercase tracking-wider">{driver.nationality ?? "Unknown"}</div>
                <h3 className="text-xl font-bold uppercase tracking-f1">{driver.name}</h3>
              </div>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
