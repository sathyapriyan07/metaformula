"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ConstructorStanding } from "../../../../types";
import { constructorStandingSchema } from "../../../../lib/validators";
import { SelectField, TextField } from "../../../../components/FormFields";
import { useReferenceStore } from "../../../../store/references";

type ConstructorStandingValues = z.input<typeof constructorStandingSchema>;

export default function ConstructorStandingForm({ initialData }: { initialData?: ConstructorStanding | null }) {
  const { teams, seasons, load } = useReferenceStore();
  const [status, setStatus] = useState<string | null>(null);
  const form = useForm<ConstructorStandingValues>({
    resolver: zodResolver(constructorStandingSchema),
    defaultValues: {
      season_id: initialData?.season_id ? String(initialData.season_id) : "",
      team_id: initialData?.team_id ? String(initialData.team_id) : "",
      position: initialData?.position?.toString() ?? "",
      points: initialData?.points?.toString() ?? "0",
      wins: initialData?.wins?.toString() ?? "0",
    },
  });

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  const onSubmit = async (values: ConstructorStandingValues) => {
    setStatus(null);
    const method = initialData ? "PUT" : "POST";
    const endpoint = initialData ? `/api/constructor-standings/${initialData.id}` : "/api/constructor-standings";
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
      <SelectField
        label="Season"
        name="season_id"
        register={form.register}
        error={form.formState.errors.season_id}
        options={seasons.map((season) => ({ value: season.id, label: String(season.year) }))}
      />
      <SelectField
        label="Team"
        name="team_id"
        register={form.register}
        error={form.formState.errors.team_id}
        options={teams.map((team) => ({ value: team.id, label: team.team_name }))}
      />
      <TextField label="Position" name="position" type="number" register={form.register} error={form.formState.errors.position} />
      <TextField label="Points" name="points" type="number" register={form.register} error={form.formState.errors.points} />
      <TextField label="Wins" name="wins" type="number" register={form.register} error={form.formState.errors.wins} />
      {status ? <p className="md:col-span-2 text-sm text-f1-cyan">{status}</p> : null}
      <div className="md:col-span-2 flex justify-end">
        <button
          type="submit"
          className="rounded-full border border-f1-cyan/40 px-6 py-2 text-xs uppercase tracking-[0.2em] text-f1-cyan"
        >
          Save Standing
        </button>
      </div>
    </form>
  );
}
