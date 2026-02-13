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
          <h1 className="section-title red-accent pb-4">TEAMS</h1>
          <p className="mt-6 text-white/70 max-w-2xl text-lg">Legendary constructors of Formula 1.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Link key={team.id} href={`/teams/${team.id}`}>
              <Card className="hover:scale-[1.03] group">
                {team.logo_url && (
                  <div className="relative h-24 mb-6 flex items-center justify-center bg-white/5 rounded-lg p-4">
                    <RemoteImage
                      src={team.logo_url}
                      alt={team.team_name}
                      fill
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="text-xs uppercase tracking-widest text-f1-red mb-3 font-bold">CONSTRUCTOR</div>
                <h2 className="text-2xl font-bold mb-6 uppercase tracking-f1">{team.team_name}</h2>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center pb-3 border-b border-white/10">
                    <span className="text-white/60 uppercase tracking-wider">Base</span>
                    <span className="font-bold text-white">{team.base_country ?? "—"}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/10">
                    <span className="text-white/60 uppercase tracking-wider">Championships</span>
                    <span className="font-bold text-f1-red text-xl">{team.championships ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 uppercase tracking-wider">Active Years</span>
                    <span className="font-bold text-white">{team.active_years ?? "—"}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        
        {!teams.length && (
          <div className="f1-panel rounded-lg p-12 text-center text-white/50">
            No teams available yet.
          </div>
        )}
      </main>
      <Footer text="Constructors and their legacy." />
    </div>
  );
}
