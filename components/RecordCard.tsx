export default function RecordCard({ title, value, subtitle }: { title: string; value: string; subtitle?: string }) {
  return (
    <article className="glass rounded-2xl p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-white/60">{title}</p>
      <p className="mt-3 font-display text-4xl tracking-[0.12em] text-white">{value}</p>
      {subtitle ? <p className="mt-2 text-sm text-white/70">{subtitle}</p> : null}
    </article>
  );
}
