"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { seasonSchema } from "../../../lib/validators";
import type { Season } from "../../../types";
import { TextField, SelectField } from "../../../components/FormFields";
import ImagePreview from "../../admin/components/ImagePreview";
import { useReferenceStore } from "../../../store/references";

type SeasonFormValues = z.input<typeof seasonSchema>;

export default function SeasonForm({ initialData }: { initialData?: Season | null }) {
  const { drivers, teams, load } = useReferenceStore();
  const [status, setStatus] = useState<string | null>(null);
  const form = useForm<SeasonFormValues>({
    resolver: zodResolver(seasonSchema),
    defaultValues: {
      year: initialData?.year ? String(initialData.year) : "",
      champion_driver_id: initialData?.champion_driver_id ? String(initialData.champion_driver_id) : "",
      champion_team_id: initialData?.champion_team_id ? String(initialData.champion_team_id) : "",
      total_races: initialData?.total_races ? String(initialData.total_races) : "0",
      banner_image_url: initialData?.banner_image_url ?? "",
    },
  });

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  const onSubmit = async (values: SeasonFormValues) => {
    setStatus(null);
    const method = initialData ? "PUT" : "POST";
    const endpoint = initialData ? `/api/seasons/${initialData.id}` : "/api/seasons";
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

  const bannerUrl = form.watch("banner_image_url");

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
      <TextField label="Year" name="year" register={form.register} error={form.formState.errors.year} />
      <TextField label="Total Races" name="total_races" type="number" register={form.register} error={form.formState.errors.total_races} />
      <SelectField
        label="Champion Driver"
        name="champion_driver_id"
        register={form.register}
        error={form.formState.errors.champion_driver_id}
        options={drivers.map((driver) => ({ value: driver.id, label: driver.name }))}
        placeholder="Select driver"
      />
      <SelectField
        label="Champion Team"
        name="champion_team_id"
        register={form.register}
        error={form.formState.errors.champion_team_id}
        options={teams.map((team) => ({ value: team.id, label: team.team_name }))}
        placeholder="Select team"
      />
      <div className="md:col-span-2">
        <TextField
          label="Banner Image URL (https://)"
          name="banner_image_url"
          register={form.register}
          error={form.formState.errors.banner_image_url}
          placeholder="https://"
        />
        <div className="mt-4">
          <ImagePreview url={bannerUrl} />
        </div>
      </div>
      {status && <p className="md:col-span-2 text-sm text-f1-cyan">{status}</p>}
      <div className="md:col-span-2 flex justify-end">
        <button
          type="submit"
          className="rounded-full border border-f1-cyan/40 px-6 py-2 text-xs uppercase tracking-[0.2em] text-f1-cyan"
        >
          Save Season
        </button>
      </div>
    </form>
  );
}
