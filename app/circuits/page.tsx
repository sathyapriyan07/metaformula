import Link from "next/link";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import { listCircuits } from "../../lib/queries";

export const dynamic = "force-dynamic";

export default async function CircuitsPage() {
  const circuits = await listCircuits();
  const formatLapLength = (value?: number | null) => (value == null ? "—" : `${value.toFixed(3)} km`);

  return (
    <div>
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-12">
        <h1 className="text-4xl md:text-6xl font-semibold mb-8">Circuits</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 fade-in-up">
          {circuits.map((circuit) => (
            <Link key={circuit.id} href={`/circuits/${circuit.id}`}>
              <Card className="rounded-2xl overflow-hidden backdrop-blur-md bg-white/5 border border-white/10 shadow-xl hover:scale-105 transition-all duration-300 ease-out p-8">
                <div className="text-xs tracking-widest uppercase text-white/60 mb-2">Circuit</div>
                <h2 className="text-2xl font-semibold text-white mb-4">{circuit.circuit_name}</h2>
                <div className="space-y-2 text-base text-white/80">
                  <div className="flex justify-between">
                    <span>Country</span>
                    <span className="font-semibold">{circuit.country ?? "\u2014"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lap Length</span>
                    <span className="font-semibold">{formatLapLength(circuit.lap_length_km)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>First GP</span>
                    <span className="font-semibold">{circuit.first_gp_year ?? "\u2014"}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
          {!circuits.length && <div className="text-sm text-f1-muted">No circuits available yet.</div>}
        </div>
      </main>
      <Footer text="Track layouts and legendary venues." />
    </div>
  );
}
