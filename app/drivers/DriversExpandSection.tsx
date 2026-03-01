"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import DriverCard from "../../components/DriverCard";

export interface DriversCardRow {
  id: number;
  name: string;
  number: string;
  imageUrl?: string | null;
  teamName?: string | null;
  teamLogoUrl?: string | null;
}

interface DriversExpandSectionProps {
  activeDrivers: DriversCardRow[];
  remainingDrivers: DriversCardRow[];
}

export default function DriversExpandSection({ activeDrivers, remainingDrivers }: DriversExpandSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const showToggle = remainingDrivers.length > 0;
  const visibleDrivers = useMemo(
    () => (expanded ? [...activeDrivers, ...remainingDrivers] : activeDrivers),
    [expanded, activeDrivers, remainingDrivers]
  );

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-black uppercase tracking-[0.14em] text-white">ACTIVE DRIVERS</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {visibleDrivers.map((driver) => (
          <Link key={driver.id} href={`/drivers/${driver.id}`} className="block h-full">
            <DriverCard
              id={driver.id}
              name={driver.name}
              number={driver.number}
              imageUrl={driver.imageUrl}
              teamName={driver.teamName}
              teamLogoUrl={driver.teamLogoUrl}
            />
          </Link>
        ))}
      </div>

      {showToggle ? (
        <div className="flex justify-center">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="rounded-full bg-f1-red px-7 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors duration-200 hover:bg-f1-red-hover"
          >
            {expanded ? "SHOW LESS" : "VIEW MORE DRIVERS"}
          </button>
        </div>
      ) : null}
    </section>
  );
}
