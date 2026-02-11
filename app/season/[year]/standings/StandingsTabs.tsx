"use client";

import { useState } from "react";
import StandingsTable, { StandingsRow } from "../../../../components/StandingsTable";

export default function StandingsTabs({
  driverRows,
  constructorRows,
}: {
  driverRows: StandingsRow[];
  constructorRows: StandingsRow[];
}) {
  const [tab, setTab] = useState<"drivers" | "constructors">("drivers");

  return (
    <div className="space-y-5">
      <div className="inline-flex rounded-full border border-white/10 bg-black/50 p-1">
        <button
          onClick={() => setTab("drivers")}
          className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.18em] transition ${
            tab === "drivers" ? "bg-f1-cyan/20 text-f1-cyan" : "text-white/60"
          }`}
        >
          Driver Standings
        </button>
        <button
          onClick={() => setTab("constructors")}
          className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.18em] transition ${
            tab === "constructors" ? "bg-f1-red/20 text-f1-red" : "text-white/60"
          }`}
        >
          Constructor Standings
        </button>
      </div>
      {tab === "drivers" ? <StandingsTable rows={driverRows} /> : <StandingsTable rows={constructorRows} />}
    </div>
  );
}
