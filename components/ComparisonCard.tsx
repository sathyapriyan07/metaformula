import Image from "next/image";

export interface ComparisonMetric {
  label: string;
  value: string | number;
}

interface ComparisonCardProps {
  name: string;
  team: string;
  imageUrl?: string | null;
  metrics: ComparisonMetric[];
}

export default function ComparisonCard({ name, team, imageUrl, metrics }: ComparisonCardProps) {
  return (
    <article className="glass rounded-2xl p-6">
      <div className="flex items-center gap-4">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} width={72} height={72} className="h-[72px] w-[72px] rounded-full object-cover" unoptimized />
        ) : (
          <div className="h-[72px] w-[72px] rounded-full border border-white/15 bg-white/5" />
        )}
        <div>
          <h3 className="text-xl font-semibold text-white">{name}</h3>
          <p className="text-sm text-white/70">{team}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3">
            <span className="text-xs uppercase tracking-[0.16em] text-white/60">{metric.label}</span>
            <span className="text-sm font-semibold text-white">{metric.value}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
