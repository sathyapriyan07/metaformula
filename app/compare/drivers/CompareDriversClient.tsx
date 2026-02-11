"use client";

import { useMemo, useState } from "react";
import ComparisonCard from "../../../components/ComparisonCard";

interface DriverComparisonData {
  id: number;
  name: string;
  team: string;
  imageUrl?: string | null;
  championships: number;
  wins: number;
  podiums: number;
  poles: number;
  fastestLaps: number;
  seasonsActive: number;
  teamsDrivenFor: string;
}

export default function CompareDriversClient({ drivers }: { drivers: DriverComparisonData[] }) {
  const [driverAId, setDriverAId] = useState<number | "">(drivers[0]?.id ?? "");
  const [driverBId, setDriverBId] = useState<number | "">(drivers[1]?.id ?? drivers[0]?.id ?? "");

  const driverA = useMemo(() => drivers.find((driver) => driver.id === Number(driverAId)) ?? null, [driverAId, drivers]);
  const driverB = useMemo(() => drivers.find((driver) => driver.id === Number(driverBId)) ?? null, [driverBId, drivers]);

  return (
    <section className="space-y-6">
      <div className="glass rounded-2xl p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label" htmlFor="driverA">
              Driver A
            </label>
            <select
              id="driverA"
              className="mt-2 w-full rounded-xl border border-white/10 bg-f1-bg/60 px-4 py-2 text-sm text-white outline-none"
              value={driverAId}
              onChange={(event) => setDriverAId(Number(event.target.value))}
            >
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="driverB">
              Driver B
            </label>
            <select
              id="driverB"
              className="mt-2 w-full rounded-xl border border-white/10 bg-f1-bg/60 px-4 py-2 text-sm text-white outline-none"
              value={driverBId}
              onChange={(event) => setDriverBId(Number(event.target.value))}
            >
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {driverA ? (
          <ComparisonCard
            name={driverA.name}
            team={driverA.team}
            imageUrl={driverA.imageUrl}
            metrics={[
              { label: "Championships", value: driverA.championships },
              { label: "Wins", value: driverA.wins },
              { label: "Podiums", value: driverA.podiums },
              { label: "Poles", value: driverA.poles },
              { label: "Fastest Laps", value: driverA.fastestLaps },
              { label: "Seasons Active", value: driverA.seasonsActive },
              { label: "Teams Driven For", value: driverA.teamsDrivenFor },
            ]}
          />
        ) : null}
        {driverB ? (
          <ComparisonCard
            name={driverB.name}
            team={driverB.team}
            imageUrl={driverB.imageUrl}
            metrics={[
              { label: "Championships", value: driverB.championships },
              { label: "Wins", value: driverB.wins },
              { label: "Podiums", value: driverB.podiums },
              { label: "Poles", value: driverB.poles },
              { label: "Fastest Laps", value: driverB.fastestLaps },
              { label: "Seasons Active", value: driverB.seasonsActive },
              { label: "Teams Driven For", value: driverB.teamsDrivenFor },
            ]}
          />
        ) : null}
      </div>
    </section>
  );
}
