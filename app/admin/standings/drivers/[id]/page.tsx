import FormLayout from "../../../components/FormLayout";
import { getDriverStanding } from "../../../../../lib/queries";
import DriverStandingForm from "../DriverStandingForm";

export default async function EditDriverStandingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const standing = await getDriverStanding(Number(id));

  return (
    <FormLayout title="Edit Driver Standing" subtitle="Update standing points, wins, and position." backHref="/admin/standings/drivers">
      <DriverStandingForm initialData={standing ?? null} />
    </FormLayout>
  );
}
