import FormLayout from "../../components/FormLayout";
import { getTimelineEvent } from "../../../../lib/queries";
import TimelineForm from "../TimelineForm";

export default async function EditTimelineEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getTimelineEvent(Number(id));

  return (
    <FormLayout title="Edit Timeline Event" subtitle="Update title, year, and visual reference." backHref="/admin/timeline">
      <TimelineForm initialData={event ?? null} />
    </FormLayout>
  );
}
