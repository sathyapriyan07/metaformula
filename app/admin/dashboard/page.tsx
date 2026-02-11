import AdminHeader from "../components/AdminHeader";
import Card from "../../../components/Card";
import {
  listCircuits,
  listConstructorStandings,
  listDriverStandings,
  listDrivers,
  listRaces,
  listSeasons,
  listTeams,
  listTimelineEvents,
} from "../../../lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const seasons = await listSeasons();
  const drivers = await listDrivers();
  const teams = await listTeams();
  const circuits = await listCircuits();
  const races = await listRaces();
  const driverStandings = await listDriverStandings();
  const constructorStandings = await listConstructorStandings();
  const timelineEvents = await listTimelineEvents();

  const metrics = [
    { label: "Seasons", value: seasons.length },
    { label: "Drivers", value: drivers.length },
    { label: "Teams", value: teams.length },
    { label: "Circuits", value: circuits.length },
    { label: "Races", value: races.length },
    { label: "Driver Standings", value: driverStandings.length },
    { label: "Constructor Standings", value: constructorStandings.length },
    { label: "Timeline Events", value: timelineEvents.length },
  ];

  return (
    <div>
      <AdminHeader
        title="Dashboard"
        description="Quick status on your historical archive. All data is curated manually."
        actionHref="/admin/seasons"
        actionLabel="Manage Seasons"
      />
      <div className="grid gap-6 md:grid-cols-2">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <div className="label">{metric.label}</div>
            <div className="mt-4 font-display text-4xl tracking-[0.2em] text-white">{metric.value}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
