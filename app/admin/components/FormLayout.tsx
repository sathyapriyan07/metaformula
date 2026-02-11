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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="label">Admin Form</div>
          <h1 className="font-display text-3xl tracking-[0.2em]">{title}</h1>
          <p className="mt-2 text-sm text-f1-muted">{subtitle}</p>
        </div>
        <Link
          href={backHref}
          className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-f1-muted"
        >
          Back
        </Link>
      </div>
      <div className="glass-strong rounded-2xl p-6">{children}</div>
    </div>
  );
}
