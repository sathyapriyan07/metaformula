import Link from "next/link";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import DriverStandingCard from "../components/DriverStandingCard";
import ConstructorStandingCard from "../components/ConstructorStandingCard";
import {
  listConstructorStandings,
  listDriverStandings,
  listDrivers,
  listSeasons,
  listTeams,
} from "../lib/queries";

export const dynamic = "force-dynamic";

function parseFeaturedSeasonId(): number | null {
  const raw = process.env.FEATURED_PREVIOUS_SEASON_ID;
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export default async function HomePage() {
  const [seasons, drivers, teams, driverStandings, constructorStandings] = await Promise.all([
    listSeasons(),
    listDrivers(),
    listTeams(),
    listDriverStandings(),
    listConstructorStandings(),
  ]);

  const seasonById = new Map(seasons.map((season) => [season.id, season]));
  const driverSeasons = new Set(driverStandings.map((row) => row.season_id));
  const constructorSeasons = new Set(constructorStandings.map((row) => row.season_id));

  const envFeaturedSeasonId = parseFeaturedSeasonId();
  const fallbackSeason = seasons.find((season) => driverSeasons.has(season.id) && constructorSeasons.has(season.id)) ?? seasons[0];
  const featuredSeason = (envFeaturedSeasonId ? seasonById.get(envFeaturedSeasonId) : null) ?? fallbackSeason;

  const selectedSeasonId = featuredSeason?.id ?? null;
  const selectedSeasonYear = featuredSeason?.year ?? null;

  const topDrivers =
    selectedSeasonId == null
      ? []
      : driverStandings
          .filter((standing) => standing.season_id === selectedSeasonId)
          .sort((a, b) => a.position - b.position)
          .slice(0, 10)
          .map((standing) => {
            const driver = drivers.find((item) => item.id === standing.driver_id);
            const team = teams.find((item) => item.id === standing.team_id);
            return {
              id: standing.id,
              position: standing.position,
              name: driver?.name ?? "Unknown Driver",
              teamName: team?.team_name ?? "Independent",
              points: Number(standing.points ?? 0),
              imageUrl: driver?.profile_image_url ?? null,
            };
          });

  const topConstructors =
    selectedSeasonId == null
      ? []
      : constructorStandings
          .filter((standing) => standing.season_id === selectedSeasonId)
          .sort((a, b) => a.position - b.position)
          .slice(0, 5)
          .map((standing) => {
            const team = teams.find((item) => item.id === standing.team_id);
            return {
              id: standing.id,
              position: standing.position,
              teamName: team?.team_name ?? "Unknown Team",
              points: Number(standing.points ?? 0),
              logoUrl: team?.logo_url ?? null,
            };
          });

  return (
    <div className="bg-[#0B0B0B]">
      <Navigation />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <div className="mb-8 rounded-xl border border-white/10 bg-[#111111] p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-f1-red">Featured Previous Season</p>
          <h1 className="mt-3 text-3xl font-black uppercase tracking-wide text-white md:text-5xl">
            {selectedSeasonYear ? `${selectedSeasonYear} Standings` : "Season Standings"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/65 md:text-base">
            Top driver and constructor standings cards curated from the selected previous season.
          </p>
        </div>

        <section>
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-xl font-black uppercase tracking-[0.12em] text-white md:text-2xl">
              PREVIOUS SEASON DRIVERS STANDINGS
            </h2>
          </div>

          {topDrivers.length ? (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {topDrivers.map((driver) => (
                  <DriverStandingCard
                    key={driver.id}
                    position={driver.position}
                    driverName={driver.name}
                    teamName={driver.teamName}
                    points={driver.points}
                    imageUrl={driver.imageUrl}
                  />
                ))}
              </div>
              {selectedSeasonYear ? (
                <div className="mt-5">
                  <Link
                    href={`/season/${selectedSeasonYear}/standings`}
                    className="inline-flex text-sm font-semibold uppercase tracking-[0.14em] text-f1-red transition-colors hover:text-[#ff2f28]"
                  >
                    View Full Standings {"->"}
                  </Link>
                </div>
              ) : null}
            </>
          ) : (
            <div className="rounded-xl border border-white/10 bg-[#111111] p-6 text-white/60">No driver standings found for this season.</div>
          )}
        </section>

        <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-f1-red/30 to-transparent" />

        <section>
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-xl font-black uppercase tracking-[0.12em] text-white md:text-2xl">
              PREVIOUS SEASON CONSTRUCTORS STANDINGS
            </h2>
          </div>

          {topConstructors.length ? (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {topConstructors.map((constructor) => (
                  <ConstructorStandingCard
                    key={constructor.id}
                    position={constructor.position}
                    teamName={constructor.teamName}
                    points={constructor.points}
                    logoUrl={constructor.logoUrl}
                  />
                ))}
              </div>
              {selectedSeasonYear ? (
                <div className="mt-5">
                  <Link
                    href={`/season/${selectedSeasonYear}/standings`}
                    className="inline-flex text-sm font-semibold uppercase tracking-[0.14em] text-f1-red transition-colors hover:text-[#ff2f28]"
                  >
                    View Full Standings {"->"}
                  </Link>
                </div>
              ) : null}
            </>
          ) : (
            <div className="rounded-xl border border-white/10 bg-[#111111] p-6 text-white/60">
              No constructor standings found for this season.
            </div>
          )}
        </section>
      </main>

      <Footer text="Previous season highlights from the F1 historical archive." />
    </div>
  );
}
