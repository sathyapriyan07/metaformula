import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import DriverSearch from "../../components/DriverSearch";
import ActiveDriversSection from "./ActiveDriversSection";

export const dynamic = "force-dynamic";

export default async function DriversPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = (params?.q ?? "").trim();

  return (
    <div>
      <Navigation />
      <main className="mx-auto w-full max-w-7xl space-y-10 px-4 py-8 md:px-8 md:py-12">
        <section className="space-y-6">
          <h1 className="section-title red-accent pb-4">DRIVERS</h1>
          <DriverSearch initialQuery={query} />
        </section>

        <ActiveDriversSection query={query} />
      </main>
      <Footer text="Legendary drivers of Formula 1." />
    </div>
  );
}
