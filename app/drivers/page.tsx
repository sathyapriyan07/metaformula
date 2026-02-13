import Link from "next/link";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import DriverCard from "../../components/DriverCard";
import { listDrivers, listTeams } from "../../lib/queries";
import { Suspense } from "react";
import { SkeletonGrid } from "../../components/Skeleton";

export const dynamic = "force-dynamic";

const NATIONALITY_TO_FLAG: Record<string, string> = {
  british: "gb", dutch: "nl", spanish: "es", monegasque: "mc", mexican: "mx",
  australian: "au", french: "fr", german: "de", finnish: "fi", italian: "it",
  japanese: "jp", canadian: "ca", american: "us", brazilian: "br", argentine: "ar",
  belgian: "be", danish: "dk", thai: "th", chinese: "cn", austrian: "at",
  swiss: "ch", swedish: "se", portuguese: "pt", polish: "pl", indian: "in",
  "new zealander": "nz", irish: "ie", "south african": "za", venezuelan: "ve"
};

const DRIVER_NUMBERS: Record<string, string> = {
  "Max Verstappen": "1", "Lewis Hamilton": "44", "Charles Leclerc": "16",
  "Lando Norris": "4", "George Russell": "63", "Carlos Sainz": "55",
  "Fernando Alonso": "14", "Sergio Perez": "11", "Oscar Piastri": "81",
  "Pierre Gasly": "10", "Esteban Ocon": "31", "Lance Stroll": "18",
  "Yuki Tsunoda": "22", "Alexander Albon": "23", "Valtteri Bottas": "77",
  "Nico Hulkenberg": "27", "Kevin Magnussen": "20", "Guanyu Zhou": "24"
};

const TEAM_COLORS: Record<string, string> = {
  "Red Bull Racing": "#1E41FF",
  Ferrari: "#E10600",
  Mercedes: "#00D2BE",
  McLaren: "#FF8700",
  "Aston Martin": "#006F62",
  Alpine: "#0090FF",
  "Williams": "#005AFF",
  "RB": "#2B4562",
  "AlphaTauri": "#2B4562",
  "Alfa Romeo": "#900000",
  "Kick Sauber": "#52E252",
  Haas: "#B6BABD",
  Independent: "#E10600",
};

function getFlagUrl(nationality?: string | null) {
  if (!nationality) return null;
  const code = NATIONALITY_TO_FLAG[nationality.trim().toLowerCase()];
  return code ? `https://flagcdn.com/w40/${code}.png` : null;
}

function getDriverNumber(name: string, id: number) {
  return DRIVER_NUMBERS[name] ?? String(id).padStart(2, "0");
}

export default function DriversPage() {
  return (
    <div>
      <Navigation />
      <main className="max-w-7xl mx-auto px-8 py-16 space-y-12">
        <div>
          <h1 className="section-title red-accent pb-4">DRIVERS</h1>
          <p className="mt-6 text-white/70 max-w-2xl text-lg">Historic Formula 1 roster curated manually.</p>
        </div>
        
        <Suspense fallback={<SkeletonGrid count={8} />}>
          <DriversGrid />
        </Suspense>
      </main>
      <Footer text="Legendary drivers of Formula 1." />
    </div>
  );
}

async function DriversGrid() {
  const [drivers, teams] = await Promise.all([listDrivers(), listTeams()]);
  const teamsById = new Map(teams.map((team) => [team.id, team.team_name] as const));

  return (
    <>
      <div className="grid grid-cols-2 gap-3 px-3 md:grid-cols-3 md:gap-4 md:px-0 lg:grid-cols-4">
        {drivers.map((driver, index) => {
          const teamName = teamsById.get(driver.team_ids?.[0] ?? -1) ?? "Independent";
          return (
            <Link key={driver.id} href={`/drivers/${driver.id}`} className="block">
              <DriverCard
                full_name={driver.name}
                driver_number={getDriverNumber(driver.name, driver.id)}
                team_name={teamName}
                nationality={driver.nationality ?? null}
                portrait_image={driver.profile_image_url ?? null}
                nationality_flag={getFlagUrl(driver.nationality)}
                team_color={TEAM_COLORS[teamName] ?? TEAM_COLORS.Independent}
                wins={driver.wins}
                podiums={driver.podiums}
                championships={driver.championships}
                index={index}
              />
            </Link>
          );
        })}
      </div>
      
      {!drivers.length && (
        <div className="f1-panel rounded-lg p-12 text-center text-white/50">
          No drivers available yet.
        </div>
      )}
    </>
  );
}
