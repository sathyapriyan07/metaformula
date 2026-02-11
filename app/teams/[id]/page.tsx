import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";
import RemoteImage from "../../../components/RemoteImage";
import { Badge } from "../../../components/Badge";
import { getTeam } from "../../../lib/queries";

export const dynamic = "force-dynamic";

export default async function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const team = await getTeam(Number(id));

  if (!team) {
    return (
      <div>
        <Navigation />
        <main className="mx-auto w-full max-w-6xl px-6 py-10">
          <p className="text-f1-muted">Team not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <section className="grid gap-8 md:grid-cols-[1fr_1.2fr]">
          <div className="flex items-center justify-center py-4">
            <RemoteImage
              src={team.logo_url ?? null}
              alt={team.team_name}
              width={300}
              height={200}
              className="max-w-full h-20 md:h-[120px] w-auto object-contain"
            />
          </div>
          <div className="glass-strong rounded-2xl p-6">
            <Badge>Constructor</Badge>
            <h1 className="mt-4 font-display text-4xl tracking-[0.2em]">{team.team_name}</h1>
            <div className="mt-4 space-y-2 text-sm text-f1-muted">
              <div className="flex justify-between">
                <span>Base Country</span>
                <span className="text-white">{team.base_country ?? "--"}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Years</span>
                <span className="text-white">{team.active_years ?? "--"}</span>
              </div>
              <div className="flex justify-between">
                <span>Championships</span>
                <span className="text-white">{team.championships ?? 0}</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer text="Constructor legacy detail." />
    </div>
  );
}
