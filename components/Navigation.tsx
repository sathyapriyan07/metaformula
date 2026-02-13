"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useReferenceStore } from "../store/references";
import { useState, useEffect } from "react";
import GlobalSearch from "./GlobalSearch";

const desktopLinks = [
  { href: "/", label: "Home" },
  { href: "/seasons", label: "Seasons" },
  { href: "/drivers", label: "Drivers" },
  { href: "/teams", label: "Teams" },
  { href: "/circuits", label: "Circuits" },
  { href: "/races", label: "Races" },
  { href: "/records", label: "Records" },
  { href: "/timeline", label: "Timeline" },
  { href: "/favorites", label: "Favorites" },
];

export default function Navigation() {
  const { user } = useReferenceStore();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const mobileLinks = [
    { href: "/", label: "Home" },
    { href: "/seasons", label: "Seasons" },
    { href: "/drivers", label: "Drivers" },
    { href: "/favorites", label: "Favorites" },
    ...(user?.role === "admin" ? [{ href: "/admin/dashboard", label: "Admin" }] : []),
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <header className={`hidden md:block sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/95 backdrop-blur-lg border-b border-white/10" : "bg-transparent"
      }`}>
        <nav className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tight uppercase text-f1-red">
            F1 ARCHIVE
          </Link>
          <div className="flex items-center gap-1">
            <GlobalSearch />
            {desktopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-semibold text-white/70 hover:text-white uppercase tracking-wider slide-underline"
              >
                {link.label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link
                href="/admin/dashboard"
                className="ml-2 px-4 py-2 text-sm font-bold bg-f1-red hover:bg-f1-red-hover text-white uppercase tracking-wider rounded"
              >
                Admin
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 bg-black/95 backdrop-blur-lg border-b border-white/10">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tight uppercase text-f1-red">
            F1 ARCHIVE
          </Link>
          <GlobalSearch />
        </div>
        
        {/* Mobile Horizontal Tabs */}
        <div className="overflow-x-auto scrollbar-none">
          <div className="flex gap-4 px-4 py-2 whitespace-nowrap">
            {desktopLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`pb-2 text-sm font-medium tracking-wide transition-colors ${
                    isActive
                      ? "text-white border-b-2 border-red-600"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>
    </>
  );
}
