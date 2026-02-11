import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";
import CompareDriversClient from "./CompareDriversClient";
import { listDriverStandings, listDrivers, listTeams } from "../../../lib/queries";

export const dynamic = "force-dynamic";

export default async function CompareDriversPage() {
  const [drivers, teams, standings] = await Promise.all([listDrivers(), listTeams(), listDriverStandings()]);

  const comparisonData = drivers.map((driver) => {
    const linkedTeams = (driver.team_ids ?? [])
      .map((teamId) => teams.find((team) => team.id === teamId)?.team_name)
      .filter((name): name is string => Boolean(name));

    const activeSeasons = new Set(standings.filter((row) => row.driver_id === driver.id).map((row) => row.season_id));

    return {
      id: driver.id,
      name: driver.name,
      team: linkedTeams[0] ?? "Independent Entry",
      imageUrl: driver.profile_image_url ?? null,
      championships: driver.championships ?? 0,
      wins: driver.wins ?? 0,
      podiums: driver.podiums ?? 0,
      poles: driver.poles ?? 0,
      fastestLaps: driver.fastest_laps ?? 0,
      seasonsActive: activeSeasons.size,
      teamsDrivenFor: linkedTeams.length ? linkedTeams.join(", ") : "—",
    };
  });

  return (
    <div>
      <Navigation />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <h1 className="section-title font-display uppercase tracking-[0.16em]">Driver Comparison</h1>
        <p className="mt-3 text-sm text-f1-muted">Compare two historical drivers side by side using curated archive statistics.</p>
        <div className="mt-8">
          <CompareDriversClient drivers={comparisonData} />
        </div>
      </main>
      <Footer text="Formula 1 driver comparison archive." />
    </div>
  );
}
