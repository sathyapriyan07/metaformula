import AdminHeader from "../components/AdminHeader";
import { listCircuits, listDrivers, listRaceResultPositions, listRaces, listSeasons } from "../../../lib/queries";
import ModuleList from "../components/ModuleList";


export const dynamic = "force-dynamic";

interface RaceRow {
  id: number;
  season: string;
  circuit: string;
  winner: string;
  laps: string;
}

export default async function AdminRacesPage() {
  const races = await listRaces();
  const seasons = await listSeasons();
  const circuits = await listCircuits();
  const drivers = await listDrivers();
  const racePositions = await listRaceResultPositions();

  const rows: RaceRow[] = races.map((race) => {
    const p1 = racePositions.find((item) => item.race_id === race.id && item.position === 1);
    return {
      id: race.id,
      season: String(seasons.find((s) => s.id === race.season_id)?.year ?? "—"),
      circuit: circuits.find((c) => c.id === race.circuit_id)?.circuit_name ?? "—",
      winner: drivers.find((d) => d.id === (p1?.driver_id ?? race.winner_driver_id))?.name ?? "—",
      laps: race.laps ? String(race.laps) : "—",
    };
  });

  const columns: { key: keyof RaceRow; label: string }[] = [
    { key: "season", label: "Season" },
    { key: "circuit", label: "Circuit" },
    { key: "winner", label: "Winner" },
    { key: "laps", label: "Laps" },
  ];

  return (
    <div>
      <AdminHeader
        title="Races"
        description="Capture race metadata and full finishing order."
        actionHref="/admin/races/new"
        actionLabel="Add Race"
      />
      <ModuleList<RaceRow> initialRows={rows} columns={columns} modulePath="/admin/races" moduleApi="/api/races" />
    </div>
  );
}

