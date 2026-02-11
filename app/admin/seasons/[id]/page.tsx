import FormLayout from "../../components/FormLayout";
import { getSeason } from "../../../../lib/queries";
import SeasonForm from "../SeasonForm";

export default async function EditSeasonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const season = await getSeason(Number(id));

  return (
    <FormLayout title="Edit Season" subtitle="Update season details." backHref="/admin/seasons">
      <SeasonForm initialData={season ?? null} />
    </FormLayout>
  );
}
