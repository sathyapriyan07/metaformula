"use client";

import Link from "next/link";
import type { CircuitRecords } from "../lib/queries";

export default function CircuitRecords({ records }: { records: CircuitRecords }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#111] p-5 mt-6">
      <h2 className="mb-5 text-xl font-bold text-white">Circuit Records</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-xs uppercase tracking-wide text-white/60">Total Races</p>
          <p className="mt-2 text-3xl font-bold text-white">{records.totalRaces}</p>
        </div>

        {records.fastestLap && (
          <>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-xs uppercase tracking-wide text-white/60">Fastest Lap</p>
              <p className="mt-2 text-2xl font-bold text-white">{records.fastestLap}</p>
              {records.fastestYear && (
                <p className="mt-1 text-xs text-white/60">{records.fastestYear}</p>
              )}
            </div>

            {records.fastestDriver && (
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-xs uppercase tracking-wide text-white/60">Fastest Driver</p>
                {records.fastestDriverId ? (
                  <Link href={`/drivers/${records.fastestDriverId}`}>
                    <p className="mt-2 text-lg font-bold text-white hover:text-red-500 transition-colors">
                      {records.fastestDriver}
                    </p>
                  </Link>
                ) : (
                  <p className="mt-2 text-lg font-bold text-white">{records.fastestDriver}</p>
                )}
                {records.fastestTeam && (
                  <p className="mt-1 text-xs text-white/60">{records.fastestTeam}</p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {!records.fastestLap && records.totalRaces > 0 && (
        <p className="mt-4 text-sm text-white/60">No lap time records available.</p>
      )}
    </section>
  );
}
