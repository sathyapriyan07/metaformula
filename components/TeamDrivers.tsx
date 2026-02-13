"use client";

import Image from "next/image";
import Link from "next/link";
import type { TeamDriverBySeason } from "../lib/queries";

export default function TeamDrivers({ seasons }: { seasons: TeamDriverBySeason[] }) {
  if (!seasons.length) {
    return (
      <section className="glass rounded-2xl p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Team Drivers</h2>
        <p className="text-sm text-white/60">No driver data available.</p>
      </section>
    );
  }

  return (
    <section className="glass rounded-2xl p-6">
      <h2 className="mb-6 text-xl font-bold text-white">Team Drivers</h2>
      <div className="space-y-6">
        {seasons.map((season) => (
          <div key={season.year}>
            <h3 className="mb-3 text-lg font-semibold text-white/90">{season.year}</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {season.drivers.map((driver) => (
                <Link key={driver.id} href={`/drivers/${driver.id}`}>
                  <article className="group rounded-xl border border-white/10 bg-white/[0.02] p-3 transition-all hover:bg-white/5 active:scale-[0.98]">
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-900">
                      {driver.portrait ? (
                        <Image
                          src={driver.portrait}
                          alt={driver.name}
                          fill
                          className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                          unoptimized
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-black" />
                      )}
                    </div>
                    <div className="mt-2">
                      <p className="truncate text-xs font-medium text-white group-hover:text-red-500">{driver.name}</p>
                      <p className="truncate text-[10px] text-white/60">{driver.nationality || "—"}</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
