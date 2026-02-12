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
  { href: "/admin/import", label: "Import" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminOnly>
      <div className="min-h-screen">
        <header className="sticky top-0 z-50 backdrop-blur-md bg-black/60 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              F1 CMS
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-white/60 hover:text-white">
                View Site
              </Link>
              <AdminSignOut />
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-8 py-8 grid md:grid-cols-[200px_1fr] gap-8">
          <aside className="glass rounded-2xl p-6 h-fit">
            <div className="text-xs text-white/50 mb-4">Admin Panel</div>
            <nav className="space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white"
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
