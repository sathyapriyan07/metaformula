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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-12">
        <h1 className="text-4xl md:text-6xl font-semibold mb-4">Formula 1 Timeline</h1>
        <p className="text-lg text-white/70 mb-8">A manually curated historical timeline across decades and landmark seasons.</p>
        <div className="relative mt-8 border-l-2 border-white/15 pl-8 fade-in-up">
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
