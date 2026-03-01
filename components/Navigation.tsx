"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import GlobalSearch from "./GlobalSearch";
import { createSupabaseBrowser } from "../lib/supabase/client";

const NAV_LINKS = [
  { href: "/drivers", label: "Drivers" },
  { href: "/teams", label: "Teams" },
  { href: "/seasons", label: "Seasons" },
  { href: "/circuits", label: "Circuits" },
];

function initialsFromEmail(email?: string | null) {
  if (!email) return "U";
  const prefix = email.split("@")[0] || "";
  return prefix.slice(0, 2).toUpperCase() || "U";
}

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [avatarOpen, setAvatarOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const supabase = createSupabaseBrowser();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const isLoggedIn = Boolean(userEmail);
  const avatarInitials = useMemo(() => initialsFromEmail(userEmail), [userEmail]);

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    setAvatarOpen(false);
    router.refresh();
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-200 ${
          scrolled
            ? "border-f1-red/25 bg-black/85 backdrop-blur-xl shadow-[0_8px_20px_rgba(225,6,0,0.08)]"
            : "border-f1-red/10 bg-black/70 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 md:h-20 md:px-6">
          <div className="hidden min-w-[320px] items-center gap-4 md:flex">
            <Link href="/" className="whitespace-nowrap text-sm font-black uppercase tracking-[0.24em] text-f1-red">
              F1 Historical Archive
            </Link>
            <nav className="flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                      active ? "text-white" : "text-white/65 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="hidden flex-1 items-center justify-center md:flex">
            <GlobalSearch variant="input" showMobileIcon={false} className="mx-auto" />
          </div>

          <div className="hidden min-w-[190px] items-center justify-end md:flex">
            {!isLoggedIn ? (
              <Link
                href="/admin/login"
                className="rounded-full bg-f1-red px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-f1-red-hover"
              >
                Login / Sign In
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setAvatarOpen((prev) => !prev)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-f1-red/40 bg-[#111111] text-sm font-bold text-white transition-colors hover:border-f1-red"
                  aria-label="Open user menu"
                >
                  {avatarInitials}
                </button>
                {avatarOpen ? (
                  <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#111111] shadow-2xl">
                    <div className="border-b border-white/10 px-4 py-3">
                      <div className="text-xs uppercase tracking-[0.15em] text-white/40">Signed in as</div>
                      <div className="mt-1 truncate text-sm text-white/85">{userEmail}</div>
                    </div>
                    <Link href="/admin/dashboard" className="block px-4 py-3 text-sm text-white/80 hover:bg-white/5">
                      Admin Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full px-4 py-3 text-left text-sm text-f1-red hover:bg-white/5"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div className="flex flex-1 items-center justify-between md:hidden">
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link href="/" className="text-xs font-black uppercase tracking-[0.2em] text-f1-red">
              F1 Archive
            </Link>

            <GlobalSearch variant="input" showMobileIcon />
          </div>
        </div>

        {mobileOpen ? (
          <div className="border-t border-f1-red/15 bg-black/95 px-4 py-4 md:hidden">
            <nav className="grid gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm uppercase tracking-[0.14em] ${
                    pathname === link.href || pathname.startsWith(`${link.href}/`)
                      ? "bg-f1-red/15 text-white"
                      : "text-white/75 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!isLoggedIn ? (
                <Link
                  href="/admin/login"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 rounded-full bg-f1-red px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.14em] text-white"
                >
                  Login / Sign In
                </Link>
              ) : (
                <button
                  onClick={handleSignOut}
                  className="mt-2 rounded-full border border-f1-red/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-f1-red"
                >
                  Sign Out
                </button>
              )}
            </nav>
          </div>
        ) : null}
      </header>
    </>
  );
}
