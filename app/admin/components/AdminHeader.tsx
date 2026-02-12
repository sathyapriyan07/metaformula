import Link from "next/link";

export default function AdminHeader({ title, description, actionHref, actionLabel }: {
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <div className="glass rounded-2xl p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div>
        <div className="text-xs text-white/50 mb-2">Admin Module</div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-sm text-white/60">{description}</p>
      </div>
      <Link
        href={actionHref}
        className="px-6 py-3 rounded-full bg-white/10 text-sm font-medium hover:bg-white/20 hover:scale-105 whitespace-nowrap"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
