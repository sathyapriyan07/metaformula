export default function RecordCard({ title, value, subtitle }: { title: string; value: string; subtitle?: string }) {
  return (
    <article className="f1-panel-hover rounded-lg p-8 group">
      <p className="text-xs uppercase tracking-widest text-f1-red font-bold mb-4">{title}</p>
      <p className="f1-stat text-white group-hover:text-f1-red transition-colors">{value}</p>
      {subtitle ? <p className="mt-4 text-sm text-white/70 uppercase tracking-wider">{subtitle}</p> : null}
    </article>
  );
}
