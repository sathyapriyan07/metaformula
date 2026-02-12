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
          <h1 className="section-title">Circuits</h1>
          <p className="mt-4 text-white/60 max-w-2xl">Legendary venues of Formula 1.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {circuits.map((circuit) => (
            <Link key={circuit.id} href={`/circuits/${circuit.id}`}>
              <Card className="hover:scale-[1.01]">
                {circuit.track_layout_url && (
                  <div className="relative aspect-video mb-6 rounded-xl overflow-hidden bg-white/5">
                    <RemoteImage
                      src={circuit.track_layout_url}
                      alt={circuit.circuit_name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="text-xs text-white/50 mb-2">Circuit</div>
                <h2 className="text-2xl font-bold mb-6">{circuit.circuit_name}</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Country</span>
                    <span className="font-medium">{circuit.country ?? "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Lap Length</span>
                    <span className="font-medium">{formatLapLength(circuit.lap_length_km)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">First GP</span>
                    <span className="font-medium">{circuit.first_gp_year ?? "—"}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        
        {!circuits.length && (
          <div className="glass rounded-2xl p-8 text-center text-white/50">
            No circuits available yet.
          </div>
        )}
      </main>
      <Footer text="Track layouts and legendary venues." />
    </div>
  );
}
