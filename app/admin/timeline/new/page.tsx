import FormLayout from "../../components/FormLayout";
import TimelineForm from "../TimelineForm";

export default function NewTimelineEventPage() {
  return (
    <FormLayout title="Add Timeline Event" subtitle="Capture a milestone moment in F1 history." backHref="/admin/timeline">
      <TimelineForm />
    </FormLayout>
  );
}
