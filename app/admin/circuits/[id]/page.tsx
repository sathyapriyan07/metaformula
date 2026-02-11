import FormLayout from "../../components/FormLayout";
import { getCircuit } from "../../../../lib/queries";
import CircuitForm from "../CircuitForm";

export default async function EditCircuitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const circuit = await getCircuit(Number(id));

  return (
    <FormLayout title="Edit Circuit" subtitle="Update circuit details." backHref="/admin/circuits">
      <CircuitForm initialData={circuit ?? null} />
    </FormLayout>
  );
}
