import Image from "next/image";

interface TimelineEventCardProps {
  year: number;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
}

export default function TimelineEventCard({ year, title, description, imageUrl }: TimelineEventCardProps) {
  return (
    <article className="glass relative rounded-2xl p-5">
      <div className="absolute -left-[11px] top-8 h-5 w-5 rounded-full border border-f1-cyan/70 bg-f1-bg shadow-neon" />
      <div className="label">{year}</div>
      <h3 className="mt-2 text-xl font-semibold text-white">{title}</h3>
      {description ? <p className="mt-2 text-sm text-white/70">{description}</p> : null}
      {imageUrl ? (
        <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
          <Image src={imageUrl} alt={title} width={1000} height={560} className="h-auto w-full object-cover" loading="lazy" unoptimized />
        </div>
      ) : null}
    </article>
  );
}
