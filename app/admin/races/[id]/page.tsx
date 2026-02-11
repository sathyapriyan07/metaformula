import FormLayout from "../../components/FormLayout";
import { getRace } from "../../../../lib/queries";
import RaceForm from "../RaceForm";

export default async function EditRacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const race = await getRace(Number(id));

  return (
    <FormLayout title="Edit Race" subtitle="Update race result details." backHref="/admin/races">
      <RaceForm initialData={race ?? null} />
    </FormLayout>
  );
}
