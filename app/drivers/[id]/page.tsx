import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";
import RemoteImage from "../../../components/RemoteImage";
import { Badge } from "../../../components/Badge";
import { StatRow } from "../../../components/StatRow";
import { getDriver, listTeams } from "../../../lib/queries";

export const dynamic = "force-dynamic";

export default async function DriverDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const driver = await getDriver(Number(id));
  const teams = await listTeams();

  if (!driver) {
    return (
      <div>
        <Navigation />
        <main className="mx-auto w-full max-w-6xl px-6 py-10">
          <p className="text-f1-muted">Driver not found.</p>
        </main>
      </div>
    );
  }

  const teamNames = (driver.team_ids ?? [])
    .map((teamId) => teams.find((t) => t.id === teamId)?.team_name)
    .filter(Boolean)
    .join(", ");

  return (
    <div>
      <Navigation />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <section className="grid gap-8 md:grid-cols-[1fr_1.2fr]">
          <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-white/10">
            <RemoteImage src={driver.profile_image_url ?? null} alt={driver.name} fill className="object-cover" />
          </div>
          <div className="glass-strong rounded-2xl p-6">
            <Badge>{driver.nationality ?? "Unknown"}</Badge>
            <h1 className="mt-4 font-display text-4xl tracking-[0.2em]">{driver.name}</h1>
            <p className="mt-2 text-sm text-f1-muted">Birthdate: {driver.birthdate ?? "â€”"}</p>
            <p className="mt-2 text-sm text-f1-muted">Teams: {teamNames || "Independent"}</p>
            <div className="mt-6 space-y-3">
              <StatRow label="Championships" value={driver.championships ?? 0} />
              <StatRow label="Wins" value={driver.wins ?? 0} />
              <StatRow label="Podiums" value={driver.podiums ?? 0} />
              <StatRow label="Poles" value={driver.poles ?? 0} />
              <StatRow label="Fastest Laps" value={driver.fastest_laps ?? 0} />
            </div>
          </div>
        </section>

        <section className="mt-8 glass-strong rounded-2xl p-6">
          <h2 className="section-title">Biography</h2>
          <p className="mt-4 text-sm text-f1-muted">{driver.biography || "No biography yet."}</p>
        </section>
      </main>
      <Footer text="Curated driver profiles." />
    </div>
  );
}
