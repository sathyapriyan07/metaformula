import AdminHeader from "../../components/AdminHeader";
import ModuleList from "../../components/ModuleList";
import { listConstructorStandings, listSeasons, listTeams } from "../../../../lib/queries";

interface ConstructorStandingRow {
  id: number;
  season: string;
  position: number;
  team: string;
  points: number;
  wins: number;
}

export default async function AdminConstructorStandingsPage() {
  const [rowsRaw, teams, seasons] = await Promise.all([listConstructorStandings(), listTeams(), listSeasons()]);

  const rows: ConstructorStandingRow[] = rowsRaw.map((standing) => ({
    id: standing.id,
    season: String(seasons.find((season) => season.id === standing.season_id)?.year ?? "—"),
    position: standing.position,
    team: teams.find((team) => team.id === standing.team_id)?.team_name ?? "—",
    points: standing.points,
    wins: standing.wins,
  }));

  const columns: { key: keyof ConstructorStandingRow; label: string }[] = [
    { key: "season", label: "Season" },
    { key: "position", label: "Pos" },
    { key: "team", label: "Team" },
    { key: "points", label: "Points" },
    { key: "wins", label: "Wins" },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Constructor Standings"
        description="Enter season constructor positions and points manually."
        actionHref="/admin/standings/constructors/new"
        actionLabel="Add Constructor Standing"
      />
      <ModuleList<ConstructorStandingRow>
        initialRows={rows}
        columns={columns}
        modulePath="/admin/standings/constructors"
        moduleApi="/api/constructor-standings"
      />
    </div>
  );
}
