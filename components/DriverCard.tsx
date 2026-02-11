import Image from "next/image";

interface DriverCardProps {
  name: string;
  number: string;
  team: string;
  image_url?: string | null;
  flag_url?: string | null;
  team_color: string;
}

export default function DriverCard({ name, number, team, image_url, flag_url, team_color }: DriverCardProps) {
  return (
    <article
      className={`relative rounded-3xl overflow-hidden backdrop-blur-md bg-white/5 border border-white/10 p-6 text-center transition hover:scale-105 min-h-[260px] ${team_color}`}
    >
      {/* Number Badge */}
      <span className="absolute top-4 right-4 text-3xl font-bold opacity-30 select-none pointer-events-none z-10">
        {number}
      </span>
      {/* Image */}
      {image_url ? (
        <div className="flex justify-center">
          <Image
            src={image_url}
            alt={name}
            width={176}
            height={176}
            className="mx-auto h-44 object-contain rounded-2xl mt-2"
            loading="lazy"
            unoptimized
          />
        </div>
      ) : null}
      {/* Country label */}
      {flag_url ? (
        <div className="flex justify-center items-center gap-2 mt-4 mb-1">
          <Image
            src={flag_url}
            alt={`${name} flag`}
            width={24}
            height={24}
            className="h-5 w-5 object-cover rounded-full border border-white/20"
            loading="lazy"
            unoptimized
          />
          <p className="text-xs tracking-widest text-white/60">{team.toUpperCase()}</p>
        </div>
      ) : null}
      {/* Name */}
      <h3 className="mt-2 text-xl font-semibold text-white truncate">{name}</h3>
    </article>
  );
}
