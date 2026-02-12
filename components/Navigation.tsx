"use client";
import Link from "next/link";
import { useReferenceStore } from "../store/references";
import { useState } from "react";
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
  const [open, setOpen] = useState(false);
  
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
      <header className="hidden md:block sticky top-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            F1 Archive
          </Link>
          <div className="flex items-center gap-2">
            <GlobalSearch />
            {desktopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-full text-sm text-white/70 hover:text-white hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link
                href="/admin/dashboard"
                className="ml-2 px-4 py-2 rounded-full text-sm bg-white/10 text-white hover:bg-white/20"
              >
                Admin
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-black/60 border-t border-white/10">
        <div className="flex items-center justify-around px-4 py-3">
          {mobileLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-white/10"
            >
              <span className="text-xs text-white/70">{link.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
