import Link from "next/link";

export default function AdminHeader({ title, description, actionHref, actionLabel }: {
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-f1-surface/70 p-6 shadow-glass md:flex-row md:items-center md:justify-between">
      <div>
        <div className="label">Admin Module</div>
        <h1 className="font-display text-3xl tracking-[0.2em] text-white">{title}</h1>
        <p className="mt-2 text-sm text-f1-muted">{description}</p>
      </div>
      <Link
        href={actionHref}
        className="rounded-full border border-f1-cyan/40 px-5 py-2 text-xs uppercase tracking-[0.2em] text-f1-cyan transition hover:border-f1-red/50 hover:text-f1-red"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
