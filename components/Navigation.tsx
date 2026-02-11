"use client";
import Link from "next/link";
import { useReferenceStore } from "../store/references";

const desktopLinks = [
  { href: "/", label: "Home" },
  { href: "/seasons", label: "Seasons" },
  { href: "/drivers", label: "Drivers" },
  { href: "/teams", label: "Teams" },
  { href: "/circuits", label: "Circuits" },
  { href: "/races", label: "Races" },
  { href: "/records", label: "Records" },
  { href: "/timeline", label: "Timeline" },
];

import { useState } from "react";

export default function Navigation() {
  const { user } = useReferenceStore();
  const [open, setOpen] = useState(false);
  const mobileLinks = [
    { href: "/", label: "Home", icon: "H" },
    { href: "/seasons", label: "Seasons", icon: "S" },
    { href: "/drivers", label: "Drivers", icon: "D" },
    { href: "/races", label: "Races", icon: "R" },
    ...(user?.role === "admin" ? [{ href: "/admin/dashboard", label: "Admin", icon: "A" }] : []),
  ];
  return (
    <header className="sticky top-0 z-50 w-full bg-transparent">
      <nav className="flex items-center justify-center py-6">
        <div className="flex items-center gap-8 px-6 py-3 rounded-full backdrop-blur-md bg-white/5 border border-white/10 shadow-xl">
          <Link href="/" className="text-2xl md:text-3xl font-semibold tracking-wide text-white flex items-center gap-2">
            F1 <span className="text-cyan-400">Archive</span>
          </Link>
          <div className="hidden md:flex gap-8 text-base items-center">
            {desktopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-full text-white/80 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 ease-out"
              >
                {link.label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 rounded-full border border-cyan-400/40 text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 ease-out"
              >
                Admin
              </Link>
            )}
          </div>
          {/* Hamburger */}
          <button className="md:hidden flex items-center px-2 py-1" onClick={() => setOpen((v) => !v)} aria-label="Open menu">
            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
      {/* Mobile menu */}
      {open && (
        <div className="md:hidden absolute left-0 right-0 top-full flex flex-col items-center gap-2 px-6 py-4 z-50 backdrop-blur-md bg-white/10 border-b border-white/10 shadow-xl rounded-b-2xl">
          {mobileLinks.map((link) => (
            <Link key={link.href} href={link.href} className="w-full text-center px-4 py-3 rounded-full text-white/90 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 ease-out">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/15 text-[10px] mr-2">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
