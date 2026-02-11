import FormLayout from "../../components/FormLayout";
import RaceForm from "../RaceForm";


export default function NewRacePage() {
  return (
    <FormLayout title="Add Race" subtitle="Create a new race result." backHref="/admin/races">
      <RaceForm />
    </FormLayout>
  );
}
