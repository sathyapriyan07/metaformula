import Link from "next/link";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import RemoteImage from "../../components/RemoteImage";
import { listCircuits } from "../../lib/queries";

export const dynamic = "force-dynamic";

export default async function CircuitsPage() {
  const circuits = await listCircuits();
  const formatLapLength = (value?: number | null) => (value == null ? "—" : `${value.toFixed(3)} km`);

  return (
    <div>
      <Navigation />
      <main className="max-w-7xl mx-auto px-8 py-16 space-y-12">
        <div>
          <h1 className="section-title red-accent pb-4">CIRCUITS</h1>
          <p className="mt-6 text-white/70 max-w-2xl text-lg">Legendary venues of Formula 1.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {circuits.map((circuit) => (
            <Link key={circuit.id} href={`/circuits/${circuit.id}`}>
              <Card className="hover:scale-[1.02] group">
                {circuit.track_layout_url && (
                  <div className="relative aspect-video mb-6 rounded-lg overflow-hidden bg-black border border-white/10">
                    <RemoteImage
                      src={circuit.track_layout_url}
                      alt={circuit.circuit_name}
                      fill
                      className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="text-xs uppercase tracking-widest text-f1-red mb-3 font-bold">CIRCUIT</div>
                <h2 className="text-2xl font-bold mb-6 uppercase tracking-f1">{circuit.circuit_name}</h2>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center pb-3 border-b border-white/10">
                    <span className="text-white/60 uppercase tracking-wider">Country</span>
                    <span className="font-bold text-white">{circuit.country ?? "—"}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/10">
                    <span className="text-white/60 uppercase tracking-wider">Lap Length</span>
                    <span className="font-bold text-f1-red">{formatLapLength(circuit.lap_length_km)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 uppercase tracking-wider">First GP</span>
                    <span className="font-bold text-white">{circuit.first_gp_year ?? "—"}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        
        {!circuits.length && (
          <div className="f1-panel rounded-lg p-12 text-center text-white/50">
            No circuits available yet.
          </div>
        )}
      </main>
      <Footer text="Track layouts and legendary venues." />
    </div>
  );
}
