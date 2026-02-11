import FormLayout from "../../../components/FormLayout";
import DriverStandingForm from "../DriverStandingForm";

export default function NewDriverStandingPage() {
  return (
    <FormLayout title="Add Driver Standing" subtitle="Enter final standings row manually." backHref="/admin/standings/drivers">
      <DriverStandingForm />
    </FormLayout>
  );
}
