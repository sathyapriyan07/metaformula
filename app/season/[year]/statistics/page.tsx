import Navigation from "../../../../components/Navigation";
import Footer from "../../../../components/Footer";
import SeasonStatsGrid from "../../../../components/SeasonStatsGrid";
import { getSeasonByYear, listDrivers, listRaces } from "../../../../lib/queries";

export const dynamic = "force-dynamic";

function buildNameMap(drivers: Awaited<ReturnType<typeof listDrivers>>) {
  return new Map(drivers.map((driver) => [driver.id, driver.name] as const));
}

export default async function SeasonStatisticsPage({ params }: { params: Promise<{ year: string }> }) {
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
        <Footer text="Season statistics archive." />
      </div>
    );
  }

  const [races, drivers] = await Promise.all([listRaces(), listDrivers()]);
  const seasonRaces = races.filter((race) => race.season_id === season.id);
  const driverNameById = buildNameMap(drivers);

  const winnerCounts = new Map<number, number>();
  const podiumCounts = new Map<number, number>();
  const winners = new Set<number>();

  for (const race of seasonRaces) {
    if (race.winner_driver_id) {
      winners.add(race.winner_driver_id);
      winnerCounts.set(race.winner_driver_id, (winnerCounts.get(race.winner_driver_id) ?? 0) + 1);
    }
    if (race.winner_driver_id) {
      podiumCounts.set(race.winner_driver_id, (podiumCounts.get(race.winner_driver_id) ?? 0) + 1);
    }
    if (race.second_driver_id) {
      podiumCounts.set(race.second_driver_id, (podiumCounts.get(race.second_driver_id) ?? 0) + 1);
    }
    if (race.third_driver_id) {
      podiumCounts.set(race.third_driver_id, (podiumCounts.get(race.third_driver_id) ?? 0) + 1);
    }
  }

  const mostWinsEntry = [...winnerCounts.entries()].sort((a, b) => b[1] - a[1])[0];
  const mostPodiumsEntry = [...podiumCounts.entries()].sort((a, b) => b[1] - a[1])[0];
  const totalLaps = seasonRaces.reduce((sum, race) => sum + (race.laps ?? 0), 0);

  const stats = [
    { label: "Total Races", value: seasonRaces.length || season.total_races },
    { label: "Unique Winners", value: winners.size },
    {
      label: "Most Wins Driver",
      value: mostWinsEntry ? driverNameById.get(mostWinsEntry[0]) ?? "—" : "—",
      caption: mostWinsEntry ? `${mostWinsEntry[1]} wins` : "No data",
    },
    {
      label: "Most Podiums",
      value: mostPodiumsEntry ? driverNameById.get(mostPodiumsEntry[0]) ?? "—" : "—",
      caption: mostPodiumsEntry ? `${mostPodiumsEntry[1]} podiums` : "No data",
    },
    { label: "Total Laps", value: totalLaps },
  ];

  return (
    <div>
      <Navigation />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <h1 className="font-display text-4xl tracking-[0.2em]">{season.year} Statistics</h1>
        <p className="mt-3 text-sm text-f1-muted">Auto-calculated analytics based on race results and season outcomes.</p>
        <div className="mt-8">
          <SeasonStatsGrid stats={stats} />
        </div>
      </main>
      <Footer text="Season statistics archive." />
    </div>
  );
}
