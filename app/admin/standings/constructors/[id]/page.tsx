import FormLayout from "../../../components/FormLayout";
import { getConstructorStanding } from "../../../../../lib/queries";
import ConstructorStandingForm from "../ConstructorStandingForm";

export default async function EditConstructorStandingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const standing = await getConstructorStanding(Number(id));

  return (
    <FormLayout
      title="Edit Constructor Standing"
      subtitle="Update constructor points, wins, and position."
      backHref="/admin/standings/constructors"
    >
      <ConstructorStandingForm initialData={standing ?? null} />
    </FormLayout>
  );
}
