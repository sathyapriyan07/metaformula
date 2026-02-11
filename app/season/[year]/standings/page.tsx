import Navigation from "../../../../components/Navigation";
import Footer from "../../../../components/Footer";
import StandingsTabs from "./StandingsTabs";
import {
  getSeasonByYear,
  listConstructorStandingsBySeason,
  listDriverStandingsBySeason,
  listDrivers,
  listTeams,
} from "../../../../lib/queries";
import type { StandingsRow } from "../../../../components/StandingsTable";

export const dynamic = "force-dynamic";

export default async function SeasonStandingsPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const seasonYear = Number(year);
  const season = await getSeasonByYear(seasonYear);

  if (!season) {
    return (
      <div>
        <Navigation />
        <main className="mx-auto w-full max-w-6xl px-6 py-10">
          <p className="text-f1-muted">Season not found.</p>
        </main>
        <Footer text="Season standings archive." />
      </div>
    );
  }

  const [driverStandings, constructorStandings, drivers, teams] = await Promise.all([
    listDriverStandingsBySeason(season.id),
    listConstructorStandingsBySeason(season.id),
    listDrivers(),
    listTeams(),
  ]);

  const driverRows: StandingsRow[] = driverStandings.map((standing) => {
    const driver = drivers.find((item) => item.id === standing.driver_id);
    const team = teams.find((item) => item.id === standing.team_id);
    return {
      id: standing.id,
      position: standing.position,
      name: driver?.name ?? "Unknown",
      team: team?.team_name ?? "—",
      points: standing.points,
      wins: standing.wins,
      image_url: driver?.profile_image_url ?? null,
      team_logo_url: team?.logo_url ?? null,
    };
  });

  const constructorRows: StandingsRow[] = constructorStandings.map((standing) => {
    const team = teams.find((item) => item.id === standing.team_id);
    return {
      id: standing.id,
      position: standing.position,
      name: team?.team_name ?? "Unknown",
      team: team?.team_name ?? "—",
      points: standing.points,
      wins: standing.wins,
      image_url: null,
      team_logo_url: team?.logo_url ?? null,
    };
  });

  return (
    <div>
      <Navigation />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <h1 className="font-display text-4xl tracking-[0.2em]">{season.year} Standings</h1>
        <p className="mt-3 text-sm text-f1-muted">Manually curated end-of-season rankings for drivers and constructors.</p>
        <div className="mt-8">
          <StandingsTabs driverRows={driverRows} constructorRows={constructorRows} />
        </div>
      </main>
      <Footer text="Season standings archive." />
    </div>
  );
}
