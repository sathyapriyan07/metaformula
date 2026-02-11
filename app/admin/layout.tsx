
import Link from "next/link";
import AdminSignOut from "../../components/AdminSignOut";
import AdminOnly from "../../components/AdminOnly";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/seasons", label: "Seasons" },
  { href: "/admin/drivers", label: "Drivers" },
  { href: "/admin/teams", label: "Teams" },
  { href: "/admin/circuits", label: "Circuits" },
  { href: "/admin/races", label: "Races" },
  { href: "/admin/standings", label: "Standings" },
  { href: "/admin/timeline", label: "Timeline" },
  { href: "/admin/media", label: "Media" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminOnly>
      <div className="min-h-screen">
        <header className="border-b border-white/10 bg-f1-bg/80 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-display text-2xl tracking-[0.3em] text-f1-red">
              F1 CMS
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/" className="text-xs uppercase tracking-[0.2em] text-f1-muted">
                View Public Site
              </Link>
              <AdminSignOut />
            </div>
          </div>
        </header>
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-8 md:grid-cols-[220px_1fr]">
          <aside className="glass rounded-2xl p-5">
            <div className="mb-4 text-xs uppercase tracking-[0.3em] text-f1-cyan">Admin Panel</div>
            <nav className="flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl border border-transparent px-3 py-2 text-sm text-f1-muted transition hover:border-f1-cyan/40 hover:text-f1-cyan"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="space-y-6">{children}</main>
        </div>
      </div>
    </AdminOnly>
  );
}
