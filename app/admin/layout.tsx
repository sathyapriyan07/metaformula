"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <AdminOnly>
      <div className="min-h-screen bg-black">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/5 text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link href="/" className="text-lg font-bold text-white">
                F1 CMS
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/" className="text-sm text-white/60 hover:text-white hidden sm:block">
                View Site
              </Link>
              <AdminSignOut />
            </div>
          </div>
        </header>

        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/80 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full w-64 bg-[#0c0c0c] border-r border-white/10 z-50 transform transition-transform duration-300 md:translate-x-0 md:static ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 border-b border-white/10 flex items-center justify-between md:hidden">
            <span className="text-sm font-semibold text-white">Menu</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-white/5 text-white"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <div className="text-xs text-white/50 mb-3 uppercase tracking-wider">Admin Panel</div>
            <nav className="space-y-1">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-red-600 text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="md:ml-64 p-3 md:p-6">{children}</main>
      </div>
    </AdminOnly>
  );
}
