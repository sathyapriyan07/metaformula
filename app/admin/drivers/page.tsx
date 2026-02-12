import AdminHeader from "../components/AdminHeader";
import { listDriversAdmin, listTeamsAdmin } from "../../../lib/queries";
import ModuleList from "../components/ModuleList";
import { StatusBadge } from "../../../components/StatusBadge";


export const dynamic = "force-dynamic";

interface DriverRow {
  id: number;
  name: string;
  nationality: string;
  titles: number;
  teams: string;
  status: "draft" | "published" | undefined;
}

export default async function AdminDriversPage() {
  const drivers = await listDriversAdmin();
  const teams = await listTeamsAdmin();

  const rows: DriverRow[] = drivers.map((driver) => ({
    id: driver.id,
    name: driver.name,
    nationality: driver.nationality ?? "—",
    titles: driver.championships ?? 0,
    teams:
      (driver.team_ids ?? [])
        .map((id) => teams.find((team) => team.id === id)?.team_name)
        .filter(Boolean)
        .join(", ") || "—",
    status: driver.status,
  }));

  const columns: { key: keyof DriverRow; label: string }[] = [
    { key: "name", label: "Name" },
    { key: "nationality", label: "Nationality" },
    { key: "titles", label: "Titles" },
    { key: "teams", label: "Teams" },
  ];

  return (
    <div>
      <AdminHeader
        title="Drivers"
        description="Create detailed driver profiles and stats."
        actionHref="/admin/drivers/new"
        actionLabel="Add Driver"
      />
      <ModuleList<DriverRow> initialRows={rows} columns={columns} modulePath="/admin/drivers" moduleApi="/api/drivers" />
    </div>
  );
}

