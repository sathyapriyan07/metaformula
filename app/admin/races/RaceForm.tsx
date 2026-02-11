"use client";

import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { raceSchema } from "../../../lib/validators";
import type { Race } from "../../../types";
import { SelectField, TextField } from "../../../components/FormFields";
import { useReferenceStore } from "../../../store/references";

type RaceFormValues = z.input<typeof raceSchema>;

const RESULT_STATUS = ["Finished", "DNF", "DNS", "DSQ"] as const;

function buildDefaultResults(initialData?: Race | null): NonNullable<RaceFormValues["results_positions"]> {
  if (initialData?.results_positions?.length) {
    return [...initialData.results_positions]
      .sort((a, b) => a.position - b.position)
      .map((row) => ({
        driver_id: String(row.driver_id),
        team_id: row.team_id ? String(row.team_id) : "",
        position: String(row.position),
        points: String(row.points ?? 0),
        laps: row.laps?.toString() ?? "",
        time: row.time ?? "",
        status: row.status ?? "Finished",
      }));
  }

  const initialPodium = [
    { driver_id: initialData?.winner_driver_id, position: 1 },
    { driver_id: initialData?.second_driver_id, position: 2 },
    { driver_id: initialData?.third_driver_id, position: 3 },
  ].filter((item) => item.driver_id);

  return initialPodium.map((item) => ({
    driver_id: String(item.driver_id),
    team_id: "",
    position: String(item.position),
    points: "0",
    laps: initialData?.laps?.toString() ?? "",
    time: "",
    status: "Finished",
  }));
}

export default function RaceForm({ initialData }: { initialData?: Race | null }) {
  const { drivers, teams, seasons, circuits, load } = useReferenceStore();
  const [status, setStatus] = useState<string | null>(null);
  const form = useForm<RaceFormValues>({
    resolver: zodResolver(raceSchema),
    defaultValues: {
      season_id: initialData?.season_id ? String(initialData.season_id) : "",
      circuit_id: initialData?.circuit_id ? String(initialData.circuit_id) : "",
      winner_driver_id: initialData?.winner_driver_id ? String(initialData.winner_driver_id) : "",
      second_driver_id: initialData?.second_driver_id ? String(initialData.second_driver_id) : "",
      third_driver_id: initialData?.third_driver_id ? String(initialData.third_driver_id) : "",
      fastest_lap_driver_id: initialData?.fastest_lap_driver_id ? String(initialData.fastest_lap_driver_id) : "",
      laps: initialData?.laps?.toString() ?? "",
      results_positions: buildDefaultResults(initialData),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "results_positions",
  });

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  const driverTeamMap = useMemo(() => {
    const map = new Map<number, number | null>();
    for (const driver of drivers) {
      map.set(driver.id, driver.team_ids?.[0] ?? null);
    }
    return map;
  }, [drivers]);

  const onSubmit = async (values: RaceFormValues) => {
    setStatus(null);
    const method = initialData ? "PUT" : "POST";
    const endpoint = initialData ? `/api/races/${initialData.id}` : "/api/races";
    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        setStatus("Failed to save. Check validation fields.");
        return;
      }
      setStatus("Saved successfully.");
    } catch {
      setStatus("Failed to save. Check validation fields.");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <SelectField
          label="Season"
          name="season_id"
          register={form.register}
          error={form.formState.errors.season_id}
          options={seasons.map((season) => ({ value: season.id, label: String(season.year) }))}
        />
        <SelectField
          label="Circuit"
          name="circuit_id"
          register={form.register}
          error={form.formState.errors.circuit_id}
          options={circuits.map((circuit) => ({ value: circuit.id, label: circuit.circuit_name }))}
        />
        <SelectField
          label="Winner (Fallback)"
          name="winner_driver_id"
          register={form.register}
          error={form.formState.errors.winner_driver_id}
          options={drivers.map((driver) => ({ value: driver.id, label: driver.name }))}
        />
        <SelectField
          label="Fastest Lap"
          name="fastest_lap_driver_id"
          register={form.register}
          error={form.formState.errors.fastest_lap_driver_id}
          options={drivers.map((driver) => ({ value: driver.id, label: driver.name }))}
        />
        <TextField label="Race Laps" name="laps" type="number" register={form.register} error={form.formState.errors.laps} />
      </div>

      <section className="rounded-2xl border border-white/10 bg-black/30 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm uppercase tracking-[0.2em] text-white/80">Full Results (P1-P20)</h3>
          <button
            type="button"
            onClick={() => {
              if (fields.length >= 20) return;
              append({
                driver_id: "",
                team_id: "",
                position: String(fields.length + 1),
                points: "0",
                laps: "",
                time: "",
                status: "Finished",
              });
            }}
            className="rounded-full border border-f1-cyan/40 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-f1-cyan"
          >
            Add Position
          </button>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.14em] text-white/60">
                <th className="px-2 py-2">Pos</th>
                <th className="px-2 py-2">Driver</th>
                <th className="px-2 py-2">Team</th>
                <th className="px-2 py-2">Points</th>
                <th className="px-2 py-2">Laps</th>
                <th className="px-2 py-2">Time</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2" />
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="border-b border-white/5">
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      min={1}
                      max={20}
                      {...form.register(`results_positions.${index}.position`)}
                      className="w-16 rounded-lg border border-white/10 bg-f1-bg/70 px-2 py-1"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <select
                      {...form.register(`results_positions.${index}.driver_id`)}
                      onChange={(event) => {
                        form.setValue(`results_positions.${index}.driver_id`, event.target.value);
                        const teamId = driverTeamMap.get(Number(event.target.value));
                        form.setValue(`results_positions.${index}.team_id`, teamId ? String(teamId) : "");
                      }}
                      className="w-full rounded-lg border border-white/10 bg-f1-bg/70 px-2 py-1"
                    >
                      <option value="">Select</option>
                      {drivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-2">
                    <select
                      {...form.register(`results_positions.${index}.team_id`)}
                      className="w-full rounded-lg border border-white/10 bg-f1-bg/70 px-2 py-1"
                    >
                      <option value="">Select</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.team_name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      step="0.1"
                      {...form.register(`results_positions.${index}.points`)}
                      className="w-20 rounded-lg border border-white/10 bg-f1-bg/70 px-2 py-1"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      {...form.register(`results_positions.${index}.laps`)}
                      className="w-20 rounded-lg border border-white/10 bg-f1-bg/70 px-2 py-1"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      placeholder="1:32:14.123"
                      {...form.register(`results_positions.${index}.time`)}
                      className="w-32 rounded-lg border border-white/10 bg-f1-bg/70 px-2 py-1"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <select
                      {...form.register(`results_positions.${index}.status`)}
                      className="rounded-lg border border-white/10 bg-f1-bg/70 px-2 py-1"
                    >
                      {RESULT_STATUS.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-2">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="rounded-full border border-f1-red/50 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-f1-red"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 md:hidden">
          {fields.map((field, index) => (
            <article key={field.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
              <div className="grid grid-cols-2 gap-3">
                <input type="number" min={1} max={20} {...form.register(`results_positions.${index}.position`)} className="rounded-lg border border-white/10 bg-f1-bg/70 px-2 py-1" />
                <select
                  {...form.register(`results_positions.${index}.status`)}
                  className="rounded-lg border border-white/10 bg-f1-bg/70 px-2 py-1"
                >
                  {RESULT_STATUS.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <select
                {...form.register(`results_positions.${index}.driver_id`)}
                onChange={(event) => {
                  form.setValue(`results_positions.${index}.driver_id`, event.target.value);
                  const teamId = driverTeamMap.get(Number(event.target.value));
                  form.setValue(`results_positions.${index}.team_id`, teamId ? String(teamId) : "");
                }}
                className="mt-3 w-full rounded-lg border border-white/10 bg-f1-bg/70 px-2 py-1"
              >
                <option value="">Select Driver</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name}
                  </option>
                ))}
              </select>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <select {...form.register(`results_positions.${index}.team_id`)} className="rounded-lg border border-white/10 bg-f1-bg/70 px-2 py-1">
                  <option value="">Team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.team_name}
                    </option>
                  ))}
                </select>
                <input type="number" step="0.1" placeholder="Points" {...form.register(`results_positions.${index}.points`)} className="rounded-lg border border-white/10 bg-f1-bg/70 px-2 py-1" />
                <input type="number" placeholder="Laps" {...form.register(`results_positions.${index}.laps`)} className="rounded-lg border border-white/10 bg-f1-bg/70 px-2 py-1" />
                <input type="text" placeholder="Time" {...form.register(`results_positions.${index}.time`)} className="rounded-lg border border-white/10 bg-f1-bg/70 px-2 py-1" />
              </div>
              <button type="button" onClick={() => remove(index)} className="mt-3 rounded-full border border-f1-red/50 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-f1-red">
                Remove
              </button>
            </article>
          ))}
        </div>
      </section>

      {status ? <p className="text-sm text-f1-cyan">{status}</p> : null}
      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-full border border-f1-cyan/40 px-6 py-2 text-xs uppercase tracking-[0.2em] text-f1-cyan"
        >
          Save Race
        </button>
      </div>
    </form>
  );
}
