import Link from "next/link";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import { listTeams } from "../../lib/queries";

export const dynamic = "force-dynamic";

export default async function TeamsPage() {
  const teams = await listTeams();

  return (
    <div>
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-12">
        <h1 className="text-4xl md:text-6xl font-semibold mb-8">Teams / Constructors</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 fade-in-up">
          {teams.map((team) => (
            <Link key={team.id} href={`/teams/${team.id}`}>
              <Card className="rounded-2xl overflow-hidden backdrop-blur-md bg-white/5 border border-white/10 shadow-xl hover:scale-105 transition-all duration-300 ease-out p-8">
                <div className="text-xs tracking-widest uppercase text-white/60 mb-2">Constructor</div>
                <h2 className="text-2xl font-semibold text-white mb-4">{team.team_name}</h2>
                <div className="space-y-2 text-base text-white/80">
                  <div className="flex justify-between">
                    <span>Base</span>
                    <span className="font-semibold">{team.base_country ?? "\u2014"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Championships</span>
                    <span className="font-semibold">{team.championships ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Years</span>
                    <span className="font-semibold">{team.active_years ?? "\u2014"}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
          {!teams.length && <div className="text-sm text-f1-muted">No teams available yet.</div>}
        </div>
      </main>
      <Footer text="Constructors and their legacy." />
    </div>
  );
}
