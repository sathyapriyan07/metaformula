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
    <article className="group relative glass rounded-2xl overflow-hidden hover:scale-105 hover:shadow-glow-hover">
      {/* Number Badge */}
      <span className="absolute top-4 right-4 text-5xl font-bold text-white/10 z-10">
        {number}
      </span>
      
      {/* Driver Image */}
      <div className="relative aspect-[3/4] bg-gradient-to-b from-white/5 to-transparent">
        {image_url && (
          <Image
            src={image_url}
            alt={name}
            fill
            className="object-contain p-4"
            loading="lazy"
            unoptimized
          />
        )}
      </div>
      
      {/* Info */}
      <div className="p-6 space-y-2">
        {flag_url && (
          <div className="flex items-center gap-2">
            <Image
              src={flag_url}
              alt={`${name} flag`}
              width={20}
              height={20}
              className="rounded-sm"
              loading="lazy"
              unoptimized
            />
            <p className="text-xs text-white/50">{team}</p>
          </div>
        )}
        <h3 className="text-xl font-semibold truncate">{name}</h3>
      </div>
    </article>
  );
}
