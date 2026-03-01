import { listDriverStandings, listDrivers, listSeasons, listTeams } from "../../lib/queries";
import DriversExpandSection, { type DriversCardRow } from "./DriversExpandSection";

const KNOWN_DRIVER_NUMBERS: Record<string, string> = {
  "Max Verstappen": "1",
  "Lewis Hamilton": "44",
  "Charles Leclerc": "16",
  "Lando Norris": "4",
  "George Russell": "63",
  "Carlos Sainz": "55",
  "Fernando Alonso": "14",
  "Sergio Perez": "11",
  "Oscar Piastri": "81",
  "Pierre Gasly": "10",
  "Esteban Ocon": "31",
  "Lance Stroll": "18",
  "Yuki Tsunoda": "22",
  "Alexander Albon": "23",
  "Valtteri Bottas": "77",
  "Nico Hulkenberg": "27",
  "Kevin Magnussen": "20",
  "Guanyu Zhou": "24",
};

function normalized(text?: string | null) {
  return (text ?? "").toLowerCase().trim();
}

function driverNumber(driver: any, fallbackRank: number) {
  const direct =
    driver?.number ??
    driver?.driver_number ??
    driver?.permanent_number ??
    KNOWN_DRIVER_NUMBERS[driver?.name ?? ""] ??
    String(fallbackRank);

  return String(direct);
}

export default async function ActiveDriversSection({ query }: { query: string }) {
  const [drivers, teams, seasons, standings] = await Promise.all([
    listDrivers(),
    listTeams(),
    listSeasons(),
    listDriverStandings(),
  ]);

  const seasonById = new Map(seasons.map((season) => [season.id, season]));
  const currentSeason = [...seasons].find((season) => standings.some((row) => row.season_id === season.id)) ?? seasons[0];

  const currentStandings = currentSeason
    ? standings
        .filter((row) => row.season_id === currentSeason.id)
        .sort((a, b) => a.position - b.position)
    : [];

  const top20Current = currentStandings.slice(0, 20);
  const top20Ids = new Set(top20Current.map((row) => row.driver_id));

  const lowerQuery = normalized(query);
  const filteredDrivers =
    !lowerQuery
      ? drivers
      : drivers.filter((driver) => {
          const nameMatch = normalized(driver.name).includes(lowerQuery);
          const nationalityMatch = normalized(driver.nationality).includes(lowerQuery);
          return nameMatch || nationalityMatch;
        });

  const teamById = new Map(teams.map((team) => [team.id, team]));
  const standingByDriverId = new Map(currentStandings.map((row) => [row.driver_id, row]));

  const activeDrivers: DriversCardRow[] = top20Current.reduce<DriversCardRow[]>((acc, standing) => {
    const driver = filteredDrivers.find((item) => item.id === standing.driver_id);
    if (!driver) return acc;

    const teamId = standing.team_id ?? driver.team_ids?.[0] ?? null;
    const team = teamId ? teamById.get(teamId) : undefined;

    acc.push({
      id: driver.id,
      name: driver.name,
      number: driverNumber(driver as any, standing.position),
      imageUrl: driver.profile_image_url ?? null,
      teamName: team?.team_name ?? "Independent",
      teamLogoUrl: team?.logo_url ?? null,
    });

    return acc;
  }, []);

  const remainingDrivers: DriversCardRow[] = filteredDrivers
    .filter((driver) => !top20Ids.has(driver.id))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((driver) => {
      const standing = standingByDriverId.get(driver.id);
      const teamId = standing?.team_id ?? driver.team_ids?.[0] ?? null;
      const team = teamId ? teamById.get(teamId) : undefined;

      return {
        id: driver.id,
        name: driver.name,
        number: driverNumber(driver as any, 0),
        imageUrl: driver.profile_image_url ?? null,
        teamName: team?.team_name ?? "Independent",
        teamLogoUrl: team?.logo_url ?? null,
      };
    });

  if (!activeDrivers.length && !remainingDrivers.length) {
    return <div className="rounded-2xl border border-white/10 bg-[#111111] p-6 text-white/60">No drivers found.</div>;
  }

  return (
    <div className="space-y-4">
      {currentSeason ? (
        <p className="text-sm uppercase tracking-[0.14em] text-white/50">
          Current season context: <span className="text-f1-red">{seasonById.get(currentSeason.id)?.year}</span>
        </p>
      ) : null}
      <DriversExpandSection activeDrivers={activeDrivers} remainingDrivers={remainingDrivers} />
    </div>
  );
}
