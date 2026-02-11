import FormLayout from "../../components/FormLayout";
import DriverForm from "../DriverForm";


export default function NewDriverPage() {
  return (
    <FormLayout title="Add Driver" subtitle="Create a new driver profile." backHref="/admin/drivers">
      <DriverForm />
    </FormLayout>
  );
}
