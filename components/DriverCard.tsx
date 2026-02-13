import Image from "next/image";

interface DriverCardProps {
  full_name: string;
  driver_number: string;
  team_name: string;
  nationality?: string | null;
  portrait_image?: string | null;
  nationality_flag?: string | null;
  team_color?: string | null;
  wins?: number | null;
  podiums?: number | null;
  championships?: number | null;
  index?: number;
}

export default function DriverCard({
  full_name,
  driver_number,
  team_name,
  nationality,
  portrait_image,
  nationality_flag,
  team_color,
  wins,
  podiums,
  championships,
  index = 0,
}: DriverCardProps) {
  const accentColor = team_color?.trim() ? team_color : "#E10600";

  return (
    <article
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#0c0c0c] transition-all duration-200 hover:scale-[1.02] [animation:fadeInUp_0.45s_ease-out_both]"
      style={{ animationDelay: `${Math.min(index, 10) * 45}ms` }}
    >
      <span className="pointer-events-none absolute right-2 top-2 z-10 font-bebas text-5xl leading-none text-white opacity-10">
        {driver_number}
      </span>

      <div className="relative h-28 overflow-hidden bg-black md:h-32">
        {portrait_image ? (
          <Image
            src={portrait_image}
            alt={full_name}
            fill
            className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            unoptimized
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-black" />
        )}
      </div>

      <div className="h-[2px] w-full bg-red-600" style={{ backgroundColor: accentColor }} />

      <div className="space-y-1.5 p-3">
        <h3 className="truncate text-sm font-semibold text-white">
          {full_name}
        </h3>

        <p className="truncate text-xs uppercase tracking-wide text-white/60">
          {team_name}
        </p>

        <div className="flex items-center gap-1 text-xs text-white/70">
          {nationality_flag && (
            <Image
              src={nationality_flag}
              alt={`${full_name} flag`}
              width={16}
              height={11}
              className="h-2.5 w-4 rounded-[2px] object-cover"
              loading="lazy"
              unoptimized
            />
          )}
          <span className="truncate">{nationality ?? "Unknown"}</span>
        </div>
      </div>
    </article>
  );
}
