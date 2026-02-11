import FormLayout from "../../components/FormLayout";
import { getDriver } from "../../../../lib/queries";
import DriverForm from "../DriverForm";

export default async function EditDriverPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const driver = await getDriver(Number(id));

  return (
    <FormLayout title="Edit Driver" subtitle="Update driver profile details." backHref="/admin/drivers">
      <DriverForm initialData={driver ?? null} />
    </FormLayout>
  );
}
