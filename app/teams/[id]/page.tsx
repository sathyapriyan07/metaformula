import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";
import RemoteImage from "../../../components/RemoteImage";
import { Badge } from "../../../components/Badge";
import FavoriteButton from "../../../components/FavoriteButton";
import { getTeam } from "../../../lib/queries";

export const dynamic = "force-dynamic";

export default async function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const team = await getTeam(Number(id));

  if (!team) {
    return (
      <div>
        <Navigation />
        <main className="max-w-6xl mx-auto px-8 py-16">
          <p className="text-white/50">Team not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <main className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          <div className="glass rounded-2xl p-8 flex items-center justify-center">
            <RemoteImage
              src={team.logo_url ?? null}
              alt={team.team_name}
              width={300}
              height={200}
              className="max-w-full h-32 w-auto object-contain"
            />
          </div>

          <div className="space-y-6">
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center justify-between mb-4">
                <Badge>Constructor</Badge>
                <FavoriteButton id={team.id} type="team" name={team.team_name} />
              </div>
              <h1 className="text-5xl font-bold mb-6">{team.team_name}</h1>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-white/60">Base Country</span>
                  <span className="font-medium">{team.base_country ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Active Years</span>
                  <span className="font-medium">{team.active_years ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Championships</span>
                  <span className="font-medium">{team.championships ?? 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer text="Constructor legacy detail." />
    </div>
  );
}
