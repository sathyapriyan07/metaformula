import FormLayout from "../../components/FormLayout";
import { getTeam } from "../../../../lib/queries";
import TeamForm from "../TeamForm";

export default async function EditTeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const team = await getTeam(Number(id));

  return (
    <FormLayout title="Edit Team" subtitle="Update constructor details." backHref="/admin/teams">
      <TeamForm initialData={team ?? null} />
    </FormLayout>
  );
}
