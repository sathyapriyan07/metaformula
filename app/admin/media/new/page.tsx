import FormLayout from "../../components/FormLayout";
import MediaForm from "../MediaForm";


export default function NewMediaPage() {
  return (
    <FormLayout title="Add Media" subtitle="Create a new media entry." backHref="/admin/media">
      <MediaForm />
    </FormLayout>
  );
}
