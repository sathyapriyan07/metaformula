import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import TimelineEventCard from "../../components/TimelineEventCard";
import { listTimelineEvents } from "../../lib/queries";

export const dynamic = "force-dynamic";

export default async function TimelinePage() {
  const events = await listTimelineEvents();

  return (
    <div>
      <Navigation />
      <main className="max-w-7xl mx-auto px-8 py-16 space-y-12">
        <div>
          <h1 className="section-title red-accent pb-4">TIMELINE</h1>
          <p className="mt-6 text-white/70 max-w-2xl text-lg">A manually curated historical timeline across decades and landmark seasons.</p>
        </div>
        <div className="relative mt-8 border-l-2 border-f1-red/30 pl-8">
          <div className="space-y-8">
            {events.map((event) => (
              <TimelineEventCard
                key={event.id}
                year={event.year}
                title={event.title}
                description={event.description ?? null}
                imageUrl={event.image_url ?? null}
              />
            ))}
          </div>
          {!events.length ? <p className="text-base text-white/60">No timeline events available yet.</p> : null}
        </div>
      </main>
      <Footer text="Formula 1 timeline archive." />
    </div>
  );
}
