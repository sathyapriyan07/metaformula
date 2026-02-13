import Navigation from "../../../../components/Navigation";
import Footer from "../../../../components/Footer";
import SeasonStatsGrid from "../../../../components/SeasonStatsGrid";
import { getSeasonByYear, getSeasonStatistics } from "../../../../lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 60;

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

  const statistics = await getSeasonStatistics(season.id);

  const stats = [
    { label: "Total Races", value: statistics.totalRaces },
    { label: "Unique Winners", value: statistics.uniqueWinners },
    {
      label: "Most Wins Driver",
      value: statistics.mostWinsDriver?.name ?? "—",
      caption: statistics.mostWinsDriver ? `${statistics.mostWinsDriver.wins} wins` : "No data",
    },
    {
      label: "Most Podiums",
      value: statistics.mostPodiums?.name ?? "—",
      caption: statistics.mostPodiums ? `${statistics.mostPodiums.podiums} podiums` : "No data",
    },
    { label: "Total Laps", value: statistics.totalLaps },
  ];

  return (
    <div>
      <Navigation />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <h1 className="font-display text-4xl tracking-[0.2em]">{season.year} Statistics</h1>
        <p className="mt-3 text-sm text-f1-muted">Auto-calculated statistics based on race results data.</p>
        <div className="mt-8">
          <SeasonStatsGrid stats={stats} />
        </div>
      </main>
      <Footer text="Season statistics archive." />
    </div>
  );
}
