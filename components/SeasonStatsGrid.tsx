interface SeasonStatistic {
  label: string;
  value: string | number;
  caption?: string;
}

export default function SeasonStatsGrid({ stats }: { stats: SeasonStatistic[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <article key={stat.label} className="glass rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-white/60">{stat.label}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{stat.value}</p>
          {stat.caption ? <p className="mt-2 text-sm text-white/70">{stat.caption}</p> : null}
        </article>
      ))}
    </div>
  );
}
