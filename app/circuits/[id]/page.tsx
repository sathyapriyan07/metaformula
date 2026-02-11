import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";
import RemoteImage from "../../../components/RemoteImage";
import { Badge } from "../../../components/Badge";
import { getCircuit } from "../../../lib/queries";

export const dynamic = "force-dynamic";

export default async function CircuitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const circuit = await getCircuit(Number(id));
  const lapLengthText = circuit?.lap_length_km == null ? "--" : circuit.lap_length_km.toFixed(3);

  if (!circuit) {
    return (
      <div>
        <Navigation />
        <main className="mx-auto w-full max-w-6xl px-6 py-10">
          <p className="text-f1-muted">Circuit not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <section className="grid gap-8 md:grid-cols-[1fr_1.2fr]">
          <div className="rounded-2xl border border-white/10 p-4">
            <RemoteImage
              src={circuit.track_layout_url ?? null}
              alt={circuit.circuit_name}
              width={800}
              height={500}
              className="mx-auto w-full h-auto max-h-[300px] md:max-h-[420px] object-contain"
            />
          </div>
          <div className="glass-strong rounded-2xl p-6">
            <Badge>Circuit</Badge>
            <h1 className="mt-4 font-display text-4xl tracking-[0.2em]">{circuit.circuit_name}</h1>
            <div className="mt-4 space-y-2 text-sm text-f1-muted">
              <div className="flex justify-between">
                <span>Country</span>
                <span className="text-white">{circuit.country ?? "--"}</span>
              </div>
              <div className="flex justify-between">
                <span>Lap Length (km)</span>
                <span className="text-white">{lapLengthText}</span>
              </div>
              <div className="flex justify-between">
                <span>First GP</span>
                <span className="text-white">{circuit.first_gp_year ?? "--"}</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer text="Circuit details and layout imagery." />
    </div>
  );
}
