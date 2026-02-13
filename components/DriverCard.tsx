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
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#111] transition-all duration-300 hover:scale-[1.03] md:hover:shadow-[0_14px_34px_rgba(225,6,0,0.28)] [animation:fadeInUp_0.45s_ease-out_both]"
      style={{ animationDelay: `${Math.min(index, 10) * 45}ms` }}
    >
      <span className="pointer-events-none absolute right-3 top-2 z-10 font-bebas text-7xl leading-none text-white opacity-10">
        {driver_number}
      </span>

      <div className="relative h-40 overflow-hidden bg-black md:h-56">
        {portrait_image ? (
          <Image
            src={portrait_image}
            alt={full_name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            unoptimized
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-black" />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      <div className="h-1 w-full" style={{ backgroundColor: accentColor }} />

      <div className="space-y-2 px-3 pb-3 pt-2 md:px-4 md:pb-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-sm font-bold uppercase tracking-tight text-white md:text-base">
            {full_name}
          </h3>
          <span className="shrink-0 text-lg font-black leading-none text-f1-red">
            {driver_number}
          </span>
        </div>

        <p className="truncate text-[11px] uppercase tracking-[0.14em] text-white/65">
          {team_name}
        </p>

        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-white/70">
          {nationality_flag && (
            <Image
              src={nationality_flag}
              alt={`${full_name} flag`}
              width={18}
              height={12}
              className="h-3 w-[18px] rounded-[2px] object-cover"
              loading="lazy"
              unoptimized
            />
          )}
          <span className="truncate">{nationality ?? "Unknown"}</span>
        </div>

        <div className="hidden items-center gap-3 border-t border-white/10 pt-2 text-[10px] uppercase tracking-[0.12em] text-white/60 md:flex">
          <span>W {wins ?? 0}</span>
          <span>P {podiums ?? 0}</span>
          <span>C {championships ?? 0}</span>
        </div>

        <span className="block h-[2px] w-0 bg-f1-red transition-all duration-300 group-hover:w-full" />
      </div>
    </article>
  );
}
