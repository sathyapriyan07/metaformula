import FormLayout from "../../components/FormLayout";
import SeasonForm from "../SeasonForm";


export default function NewSeasonPage() {
  return (
    <FormLayout title="Add Season" subtitle="Create a new season record." backHref="/admin/seasons">
      <SeasonForm />
    </FormLayout>
  );
}
