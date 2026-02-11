import FormLayout from "../../components/FormLayout";
import TeamForm from "../TeamForm";


export default function NewTeamPage() {
  return (
    <FormLayout title="Add Team" subtitle="Create a new constructor profile." backHref="/admin/teams">
      <TeamForm />
    </FormLayout>
  );
}
