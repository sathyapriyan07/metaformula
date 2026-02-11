import FormLayout from "../../../components/FormLayout";
import ConstructorStandingForm from "../ConstructorStandingForm";

export default function NewConstructorStandingPage() {
  return (
    <FormLayout
      title="Add Constructor Standing"
      subtitle="Enter final constructor standings row manually."
      backHref="/admin/standings/constructors"
    >
      <ConstructorStandingForm />
    </FormLayout>
  );
}
