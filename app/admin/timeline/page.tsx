import AdminHeader from "../components/AdminHeader";
import ModuleList from "../components/ModuleList";
import AdminOnly from "../../../components/AdminOnly";
import { listTimelineEvents } from "../../../lib/queries";

interface TimelineRow {
  id: number;
  year: number;
  title: string;
  description: string;
}

export default async function AdminTimelinePage() {
  const events = await listTimelineEvents();
  const rows: TimelineRow[] = events.map((event) => ({
    id: event.id,
    year: event.year,
    title: event.title,
    description: event.description ?? "—",
  }));

  const columns: { key: keyof TimelineRow; label: string }[] = [
    { key: "year", label: "Year" },
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
  ];

    return (
      <AdminOnly>
        <div className="space-y-6">
          <AdminHeader
            title="Timeline Control"
            description="Add, edit, and remove historical Formula 1 timeline events."
            actionHref="/admin/timeline/new"
            actionLabel="Add Event"
          />
          <ModuleList<TimelineRow> initialRows={rows} columns={columns} modulePath="/admin/timeline" moduleApi="/api/timeline" />
        </div>
      </AdminOnly>
    );
}
