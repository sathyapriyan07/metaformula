import Link from "next/link";

export default function FormLayout({
  title,
  subtitle,
  backHref,
  children,
}: {
  title: string;
  subtitle: string;
  backHref: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-xs text-white/50 uppercase tracking-wider mb-1">Admin Form</div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
          <p className="mt-1 text-sm text-white/60">{subtitle}</p>
        </div>
        <Link
          href={backHref}
          className="w-full sm:w-auto rounded-lg border border-white/20 px-4 py-2 text-xs uppercase tracking-wider text-white/70 hover:bg-white/5 transition-colors text-center"
        >
          Back
        </Link>
      </div>
      <div className="glass-strong rounded-xl p-4 md:p-6">{children}</div>
    </div>
  );
}
