import FormLayout from "../../components/FormLayout";
import CircuitForm from "../CircuitForm";


export default function NewCircuitPage() {
  return (
    <FormLayout title="Add Circuit" subtitle="Create a new circuit profile." backHref="/admin/circuits">
      <CircuitForm />
    </FormLayout>
  );
}
