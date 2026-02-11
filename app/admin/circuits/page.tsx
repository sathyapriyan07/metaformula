import AdminHeader from "../components/AdminHeader";
import { listCircuits } from "../../../lib/queries";
import ModuleList from "../components/ModuleList";


export const dynamic = "force-dynamic";

interface CircuitRow {
  id: number;
  circuit: string;
  country: string;
  length: string;
  first_gp: string;
}

export default async function AdminCircuitsPage() {
  const circuits = await listCircuits();

  const rows: CircuitRow[] = circuits.map((circuit) => ({
    id: circuit.id,
    circuit: circuit.circuit_name,
    country: circuit.country ?? "—",
    length: circuit.lap_length_km == null ? "—" : `${circuit.lap_length_km.toFixed(3)} km`,
    first_gp: circuit.first_gp_year ? String(circuit.first_gp_year) : "—",
  }));

  const columns: { key: keyof CircuitRow; label: string }[] = [
    { key: "circuit", label: "Circuit" },
    { key: "country", label: "Country" },
    { key: "length", label: "Lap Length" },
    { key: "first_gp", label: "First GP" },
  ];

  return (
    <div>
      <AdminHeader
        title="Circuits"
        description="Manage circuit entries and layout details."
        actionHref="/admin/circuits/new"
        actionLabel="Add Circuit"
      />
      <ModuleList<CircuitRow> initialRows={rows} columns={columns} modulePath="/admin/circuits" moduleApi="/api/circuits" />
    </div>
  );
}

