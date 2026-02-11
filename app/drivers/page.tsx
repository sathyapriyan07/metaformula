import Link from "next/link";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import DriverCard from "../../components/DriverCard";
import { listDrivers, listTeams } from "../../lib/queries";

export const dynamic = "force-dynamic";

const TEAM_GRADIENTS: Record<string, string> = {
  alpine: "bg-gradient-to-br from-blue-700/80 via-blue-800/75 to-slate-950/95",
  "aston martin": "bg-gradient-to-br from-emerald-700/75 via-emerald-900/85 to-slate-950/95",
  ferrari: "bg-gradient-to-br from-red-700/85 via-red-900/90 to-black/95",
  mercedes: "bg-gradient-to-br from-cyan-600/70 via-teal-800/80 to-slate-950/95",
  mclaren: "bg-gradient-to-br from-orange-600/80 via-orange-800/85 to-slate-950/95",
  redbull: "bg-gradient-to-br from-indigo-700/80 via-blue-900/90 to-slate-950/95",
  "red bull": "bg-gradient-to-br from-indigo-700/80 via-blue-900/90 to-slate-950/95",
  haas: "bg-gradient-to-br from-stone-500/65 via-zinc-800/85 to-black/95",
  williams: "bg-gradient-to-br from-sky-600/75 via-blue-900/85 to-black/95",
  sauber: "bg-gradient-to-br from-lime-600/75 via-lime-800/85 to-black/95",
  "kick sauber": "bg-gradient-to-br from-lime-600/75 via-lime-800/85 to-black/95",
  rb: "bg-gradient-to-br from-violet-700/75 via-blue-900/90 to-black/95"
};

const NATIONALITY_TO_FLAG: Record<string, string> = {
  british: "gb",
  dutch: "nl",
  spanish: "es",
  monegasque: "mc",
  mexican: "mx",
  australian: "au",
  french: "fr",
  german: "de",
  finnish: "fi",
  italian: "it",
  japanese: "jp",
  canadian: "ca",
  american: "us",
  brazilian: "br",
  argentine: "ar",
  belgian: "be",
  danish: "dk",
  thai: "th",
  chinese: "cn",
  austrian: "at",
  swiss: "ch",
  swedish: "se",
  portuguese: "pt",
  polish: "pl",
  indian: "in",
  "new zealander": "nz",
  irish: "ie",
  "south african": "za",
  venezuelan: "ve"
};

const DRIVER_NUMBERS: Record<string, string> = {
  "Max Verstappen": "1",
  "Lewis Hamilton": "44",
  "Charles Leclerc": "16",
  "Lando Norris": "4",
  "George Russell": "63",
  "Carlos Sainz": "55",
  "Fernando Alonso": "14",
  "Sergio Perez": "11",
  "Oscar Piastri": "81",
  "Pierre Gasly": "10",
  "Esteban Ocon": "31",
  "Lance Stroll": "18",
  "Yuki Tsunoda": "22",
  "Alexander Albon": "23",
  "Valtteri Bottas": "77",
  "Nico Hulkenberg": "27",
  "Kevin Magnussen": "20",
  "Guanyu Zhou": "24"
};

function getTeamGradient(teamName: string) {
  const normalized = teamName.trim().toLowerCase();
  for (const [team, gradient] of Object.entries(TEAM_GRADIENTS)) {
    if (normalized.includes(team)) return gradient;
  }
  return "bg-gradient-to-br from-slate-700/70 via-slate-900/90 to-black/95";
}

function getFlagUrl(nationality?: string | null) {
  if (!nationality) return null;
  const code = NATIONALITY_TO_FLAG[nationality.trim().toLowerCase()];
  if (!code) return null;
  return `https://flagcdn.com/w40/${code}.png`;
}

function getDriverNumber(name: string, id: number) {
  return DRIVER_NUMBERS[name] ?? String(id).padStart(2, "0");
}

export default async function DriversPage() {
  const [drivers, teams] = await Promise.all([listDrivers(), listTeams()]);
  const teamsById = new Map(teams.map((team) => [team.id, team.team_name] as const));

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_15%_10%,rgba(255,45,60,0.2),transparent_35%),radial-gradient(circle_at_85%_15%,rgba(22,242,255,0.16),transparent_30%),linear-gradient(160deg,#05060b_0%,#050910_45%,#05060b_100%)]">
      <Navigation />
      <main className="mx-auto w-full max-w-7xl px-6 py-10 md:py-14">
        <h1 className="section-title font-display uppercase tracking-[0.12em]">Drivers</h1>
        <p className="mt-3 max-w-2xl text-sm text-white/70">Historic Formula 1 roster curated manually from the archive CMS.</p>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 xl:gap-8">
          {drivers.map((driver) => {
            const teamName = teamsById.get(driver.team_ids?.[0] ?? -1) ?? "Independent Entry";
            return (
              <Link key={driver.id} href={`/drivers/${driver.id}`} className="block">
                <DriverCard
                  name={driver.name}
                  number={getDriverNumber(driver.name, driver.id)}
                  team={teamName}
                  image_url={driver.profile_image_url ?? null}
                  flag_url={getFlagUrl(driver.nationality)}
                  team_color={getTeamGradient(teamName)}
                />
              </Link>
            );
          })}
          {!drivers.length ? (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-sm text-f1-muted">No drivers available yet.</div>
          ) : null}
        </div>
      </main>
      <Footer text="Poster-style profiles of Formula 1 legends." />
    </div>
  );
}
