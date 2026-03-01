import RemoteImage from "./RemoteImage";

interface DriverStandingCardProps {
  position: number;
  driverName: string;
  teamName: string;
  points: number;
  imageUrl?: string | null;
}

export default function DriverStandingCard({
  position,
  driverName,
  teamName,
  points,
  imageUrl,
}: DriverStandingCardProps) {
  return (
    <article className="group relative h-full rounded-xl border border-white/10 bg-[#111111] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.015] hover:border-f1-red/50 hover:shadow-[0_12px_30px_rgba(225,6,0,0.2)]">
      <div className="absolute left-4 top-4 inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-f1-red/50 bg-black/70 px-2 text-xs font-bold text-f1-red">
        P{position}
      </div>

      <div className="mx-auto mt-6 mb-5 flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/60">
        <RemoteImage src={imageUrl ?? null} alt={driverName} width={112} height={112} className="h-full w-full object-cover object-top" />
      </div>

      <h3 className="text-center text-lg font-black uppercase tracking-wide text-white">{driverName}</h3>
      <p className="mt-1 text-center text-sm text-white/65">{teamName}</p>

      <div className="mt-6 border-t border-white/10 pt-4 text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-white/45">Points</div>
        <div className="mt-2 text-4xl font-black leading-none text-f1-red">{points}</div>
      </div>
    </article>
  );
}
