import { getSeasonByYear, getSeasonRaceTable } from "../../../lib/queries";
import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";
import SeasonDetailClient from "./SeasonDetailClient";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function SeasonDetailPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const yearNum = parseInt(year, 10);
  
  const season = await getSeasonByYear(yearNum);
  
  if (!season) {
    return (
      <div>
        <Navigation />
        <main className="mx-auto w-full max-w-6xl px-6 py-10">
          <p className="text-f1-muted">Season not found.</p>
        </main>
        <Footer text="Season archive." />
      </div>
    );
  }
  
  const rows = await getSeasonRaceTable(season.id);
  
  return <SeasonDetailClient seasonId={season.id} seasonYear={season.year} rows={rows} />;
}
