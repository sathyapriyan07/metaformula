
import AdminHeader from "../components/AdminHeader";
import { listDrivers, listSeasons, listTeams } from "../../../lib/queries";
import ModuleList from "../components/ModuleList";
import AdminOnly from "../../../components/AdminOnly";


export const dynamic = "force-dynamic";

interface SeasonRow {
  id: number;
  year: number;
  champion: string;
  team: string;
  races: number;
}

export default async function AdminSeasonsPage() {
  const seasons = await listSeasons();
  const drivers = await listDrivers();
  const teams = await listTeams();

  const rows: SeasonRow[] = seasons.map((season) => ({
    id: season.id,
    year: season.year,
    champion: drivers.find((d) => d.id === season.champion_driver_id)?.name ?? "—",
    team: teams.find((t) => t.id === season.champion_team_id)?.team_name ?? "—",
    races: season.total_races,
  }));

  const columns: { key: keyof SeasonRow; label: string }[] = [
    { key: "year", label: "Year" },
    { key: "champion", label: "Champion" },
    { key: "team", label: "Team" },
    { key: "races", label: "Races" },
  ];

  return (
    <AdminOnly>
      <div>
        <AdminHeader
          title="Seasons"
          description="Create, edit, and curate every historical season."
          actionHref="/admin/seasons/new"
          actionLabel="Add Season"
        />
        <ModuleList<SeasonRow> initialRows={rows} columns={columns} modulePath="/admin/seasons" moduleApi="/api/seasons" />
      </div>
    </AdminOnly>
  );
}

