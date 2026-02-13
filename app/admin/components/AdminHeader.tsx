import Link from "next/link";

export default function AdminHeader({ title, description, actionHref, actionLabel }: {
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <div className="glass rounded-xl p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
      <div>
        <div className="text-xs text-white/50 mb-1 uppercase tracking-wider">Admin Module</div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
        <p className="mt-1 text-sm text-white/60">{description}</p>
      </div>
      <Link
        href={actionHref}
        className="w-full md:w-auto px-4 py-2.5 rounded-lg bg-red-600 text-sm font-medium text-white hover:bg-red-700 transition-colors text-center whitespace-nowrap"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
