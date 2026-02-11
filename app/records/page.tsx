import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import RecordCard from "../../components/RecordCard";
import { listDriverStandings, listDrivers, listSeasons } from "../../lib/queries";

export const dynamic = "force-dynamic";

function findMaxBy<T>(items: T[], value: (item: T) => number) {
  return items.reduce<T | null>((best, item) => {
    if (!best || value(item) > value(best)) return item;
    return best;
  }, null);
}

export default async function RecordsPage() {
  const [drivers, seasons, standings] = await Promise.all([listDrivers(), listSeasons(), listDriverStandings()]);

  const mostChampionships = findMaxBy(drivers, (driver) => driver.championships ?? 0);
  const mostWins = findMaxBy(drivers, (driver) => driver.wins ?? 0);
  const mostPodiums = findMaxBy(drivers, (driver) => driver.podiums ?? 0);

  const youngestChampion = seasons
    .map((season) => {
      const driver = drivers.find((item) => item.id === season.champion_driver_id);
      if (!driver?.birthdate) return null;
      const birthDate = new Date(driver.birthdate);
      if (Number.isNaN(birthDate.getTime())) return null;
      const age = season.year - birthDate.getFullYear();
      return { season: season.year, driver: driver.name, age };
    })
    .filter((entry): entry is { season: number; driver: string; age: number } => Boolean(entry))
    .sort((a, b) => a.age - b.age)[0];

  const seasonYearById = new Map(seasons.map((season) => [season.id, season.year] as const));
  const longestCareer = drivers
    .map((driver) => {
      const years = standings
        .filter((standing) => standing.driver_id === driver.id)
        .map((standing) => seasonYearById.get(standing.season_id))
        .filter((value): value is number => typeof value === "number")
        .sort((a, b) => a - b);
      if (!years.length) return { name: driver.name, span: 0, range: "—" };
      const span = years[years.length - 1] - years[0] + 1;
      return { name: driver.name, span, range: `${years[0]} - ${years[years.length - 1]}` };
    })
    .sort((a, b) => b.span - a.span)[0];

  const cards = [
    {
      title: "Most Championships",
      value: mostChampionships?.name ?? "—",
      subtitle: `${mostChampionships?.championships ?? 0} titles`,
    },
    {
      title: "Most Wins",
      value: mostWins?.name ?? "—",
      subtitle: `${mostWins?.wins ?? 0} wins`,
    },
    {
      title: "Most Podiums",
      value: mostPodiums?.name ?? "—",
      subtitle: `${mostPodiums?.podiums ?? 0} podiums`,
    },
    {
      title: "Youngest Champion",
      value: youngestChampion?.driver ?? "—",
      subtitle: youngestChampion ? `${youngestChampion.age} years old in ${youngestChampion.season}` : "No data",
    },
    {
      title: "Longest Career",
      value: longestCareer?.name ?? "—",
      subtitle: longestCareer?.span ? `${longestCareer.span} seasons (${longestCareer.range})` : "No data",
    },
  ];

  return (
    <div>
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-12">
        <h1 className="text-4xl md:text-6xl font-semibold mb-4">Records</h1>
        <p className="text-lg text-white/70 mb-8">Automatically derived milestones from the historical archive database.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 fade-in-up">
          {cards.map((card) => (
            <RecordCard key={card.title} title={card.title} value={card.value} subtitle={card.subtitle} />
          ))}
        </div>
      </main>
      <Footer text="Formula 1 all-time records archive." />
    </div>
  );
}
