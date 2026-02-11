
import AdminHeader from "../components/AdminHeader";
import { listTeams } from "../../../lib/queries";
import ModuleList from "../components/ModuleList";
import AdminOnly from "../../../components/AdminOnly";


export const dynamic = "force-dynamic";

interface TeamRow {
  id: number;
  team: string;
  base: string;
  titles: number;
  years: string;
}

export default async function AdminTeamsPage() {
  const teams = await listTeams();

  const rows: TeamRow[] = teams.map((team) => ({
    id: team.id,
    team: team.team_name,
    base: team.base_country ?? "—",
    titles: team.championships ?? 0,
    years: team.active_years ?? "—",
  }));

  const columns: { key: keyof TeamRow; label: string }[] = [
    { key: "team", label: "Team" },
    { key: "base", label: "Base" },
    { key: "titles", label: "Titles" },
    { key: "years", label: "Active Years" },
  ];

  return (
    <AdminOnly>
      <div>
        <AdminHeader
          title="Teams"
          description="Manage constructors and their legacy."
          actionHref="/admin/teams/new"
          actionLabel="Add Team"
        />
        <ModuleList<TeamRow> initialRows={rows} columns={columns} modulePath="/admin/teams" moduleApi="/api/teams" />
      </div>
    </AdminOnly>
  );
}

