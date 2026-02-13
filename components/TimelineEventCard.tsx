import Image from "next/image";

interface TimelineEventCardProps {
  year: number;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
}

export default function TimelineEventCard({ year, title, description, imageUrl }: TimelineEventCardProps) {
  return (
    <article className="f1-panel rounded-lg p-6 relative group hover:border-f1-red/50 transition-all">
      <div className="absolute -left-[13px] top-8 h-6 w-6 rounded-full bg-f1-red border-4 border-black" />
      <div className="text-xs uppercase tracking-widest text-f1-red font-bold mb-3">{year}</div>
      <h3 className="text-2xl font-bold uppercase tracking-f1 text-white mb-3">{title}</h3>
      {description ? <p className="text-sm text-white/70 leading-relaxed">{description}</p> : null}
      {imageUrl ? (
        <div className="mt-4 overflow-hidden rounded-lg border border-white/10">
          <Image src={imageUrl} alt={title} width={1000} height={560} className="h-auto w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" unoptimized />
        </div>
      ) : null}
    </article>
  );
}
