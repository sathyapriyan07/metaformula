import AdminHeader from "../../components/AdminHeader";
import ModuleList from "../../components/ModuleList";
import AdminOnly from "../../../../components/AdminOnly";
import { listDriverStandings, listDrivers, listSeasons, listTeams } from "../../../../lib/queries";

interface DriverStandingRow {
  id: number;
  season: string;
  position: number;
  driver: string;
  team: string;
  points: number;
  wins: number;
}

export default async function AdminDriverStandingsPage() {
  const [rowsRaw, drivers, teams, seasons] = await Promise.all([
    listDriverStandings(),
    listDrivers(),
    listTeams(),
    listSeasons(),
  ]);

  const rows: DriverStandingRow[] = rowsRaw.map((standing) => ({
    id: standing.id,
    season: String(seasons.find((season) => season.id === standing.season_id)?.year ?? "—"),
    position: standing.position,
    driver: drivers.find((driver) => driver.id === standing.driver_id)?.name ?? "—",
    team: teams.find((team) => team.id === standing.team_id)?.team_name ?? "—",
    points: standing.points,
    wins: standing.wins,
  }));

  const columns: { key: keyof DriverStandingRow; label: string }[] = [
    { key: "season", label: "Season" },
    { key: "position", label: "Pos" },
    { key: "driver", label: "Driver" },
    { key: "team", label: "Team" },
    { key: "points", label: "Points" },
    { key: "wins", label: "Wins" },
  ];

  return (
      <AdminOnly>
        <div className="space-y-6">
      <AdminHeader
        title="Driver Standings"
        description="Enter season points and final positions manually."
        actionHref="/admin/standings/drivers/new"
        actionLabel="Add Driver Standing"
      />
      <ModuleList<DriverStandingRow>
        initialRows={rows}
        columns={columns}
        modulePath="/admin/standings/drivers"
        moduleApi="/api/driver-standings"
      />
    </div>
      </AdminOnly>
  );
}
