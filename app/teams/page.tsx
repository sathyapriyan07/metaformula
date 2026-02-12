import Link from "next/link";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import RemoteImage from "../../components/RemoteImage";
import { listTeams } from "../../lib/queries";

export const dynamic = "force-dynamic";

export default async function TeamsPage() {
  const teams = await listTeams();

  return (
    <div>
      <Navigation />
      <main className="max-w-7xl mx-auto px-8 py-16 space-y-12">
        <div>
          <h1 className="section-title">Teams</h1>
          <p className="mt-4 text-white/60 max-w-2xl">Legendary constructors of Formula 1.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Link key={team.id} href={`/teams/${team.id}`}>
              <Card className="hover:scale-105">
                {team.logo_url && (
                  <div className="relative h-24 mb-6 flex items-center justify-center">
                    <RemoteImage
                      src={team.logo_url}
                      alt={team.team_name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="text-xs text-white/50 mb-2">Constructor</div>
                <h2 className="text-2xl font-bold mb-6">{team.team_name}</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Base</span>
                    <span className="font-medium">{team.base_country ?? "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Championships</span>
                    <span className="font-medium">{team.championships ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Active Years</span>
                    <span className="font-medium">{team.active_years ?? "—"}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        
        {!teams.length && (
          <div className="glass rounded-2xl p-8 text-center text-white/50">
            No teams available yet.
          </div>
        )}
      </main>
      <Footer text="Constructors and their legacy." />
    </div>
  );
}
