import Link from "next/link";
import AdminHeader from "../components/AdminHeader";
import Card from "../../../components/Card";

export default function AdminStandingsPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Standings Control"
        description="Manually manage season driver and constructor standings."
        actionHref="/admin/standings/drivers"
        actionLabel="Driver Standings"
      />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <div className="label">Driver Standings</div>
          <h2 className="mt-3 text-xl font-semibold text-white">Edit Driver Points</h2>
          <p className="mt-2 text-sm text-f1-muted">Create and update per-season driver positions, points, and wins.</p>
          <Link
            href="/admin/standings/drivers"
            className="mt-5 inline-flex rounded-full border border-f1-cyan/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-f1-cyan"
          >
            Manage Drivers
          </Link>
        </Card>
        <Card>
          <div className="label">Constructor Standings</div>
          <h2 className="mt-3 text-xl font-semibold text-white">Edit Constructor Points</h2>
          <p className="mt-2 text-sm text-f1-muted">Create and update per-season constructor positions, points, and wins.</p>
          <Link
            href="/admin/standings/constructors"
            className="mt-5 inline-flex rounded-full border border-f1-cyan/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-f1-cyan"
          >
            Manage Constructors
          </Link>
        </Card>
      </div>
    </div>
  );
}
