import FormLayout from "../../components/FormLayout";
import { getMedia } from "../../../../lib/queries";
import MediaForm from "../MediaForm";

export default async function EditMediaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const media = await getMedia(Number(id));

  return (
    <FormLayout title="Edit Media" subtitle="Update media details." backHref="/admin/media">
      <MediaForm initialData={media ?? null} />
    </FormLayout>
  );
}
