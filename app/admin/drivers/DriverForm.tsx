"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { driverSchema } from "../../../lib/validators";
import type { Driver } from "../../../types";
import { TextAreaField, TextField } from "../../../components/FormFields";
import MultiSelectField from "../../../components/MultiSelectField";
import ImagePreview from "../../admin/components/ImagePreview";
import { useReferenceStore } from "../../../store/references";

type DriverFormValues = z.input<typeof driverSchema>;

export default function DriverForm({ initialData }: { initialData?: Driver | null }) {
  const { teams, load } = useReferenceStore();
  const [status, setStatus] = useState<string | null>(null);
  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      nationality: initialData?.nationality ?? "",
      birthdate: initialData?.birthdate ?? "",
      profile_image_url: initialData?.profile_image_url ?? "",
      championships: initialData?.championships?.toString() ?? "0",
      wins: initialData?.wins?.toString() ?? "0",
      podiums: initialData?.podiums?.toString() ?? "0",
      poles: initialData?.poles?.toString() ?? "0",
      fastest_laps: initialData?.fastest_laps?.toString() ?? "0",
      biography: initialData?.biography ?? "",
      team_ids: initialData?.team_ids ?? [],
    },
  });

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  const onSubmit = async (values: DriverFormValues) => {
    setStatus(null);
    const method = initialData ? "PUT" : "POST";
    const endpoint = initialData ? `/api/drivers/${initialData.id}` : "/api/drivers";
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

  const profileUrl = form.watch("profile_image_url");

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
      <TextField label="Name" name="name" register={form.register} error={form.formState.errors.name} />
      <TextField label="Nationality" name="nationality" register={form.register} error={form.formState.errors.nationality} />
      <TextField label="Birthdate" name="birthdate" register={form.register} error={form.formState.errors.birthdate} placeholder="YYYY-MM-DD" />
      <TextField label="Profile Image URL (https://)" name="profile_image_url" register={form.register} error={form.formState.errors.profile_image_url} />
      <TextField label="Championships" name="championships" type="number" register={form.register} error={form.formState.errors.championships} />
      <TextField label="Wins" name="wins" type="number" register={form.register} error={form.formState.errors.wins} />
      <TextField label="Podiums" name="podiums" type="number" register={form.register} error={form.formState.errors.podiums} />
      <TextField label="Poles" name="poles" type="number" register={form.register} error={form.formState.errors.poles} />
      <TextField label="Fastest Laps" name="fastest_laps" type="number" register={form.register} error={form.formState.errors.fastest_laps} />
      <div className="md:col-span-2">
        <MultiSelectField
          label="Teams"
          name="team_ids"
          control={form.control}
          options={teams.map((team) => ({ value: team.id, label: team.team_name }))}
          error={form.formState.errors.team_ids}
        />
      </div>
      <div className="md:col-span-2">
        <TextAreaField label="Biography" name="biography" register={form.register} error={form.formState.errors.biography} />
      </div>
      <div className="md:col-span-2">
        <ImagePreview url={profileUrl} />
      </div>
      {status && <p className="md:col-span-2 text-sm text-f1-cyan">{status}</p>}
      <div className="md:col-span-2 flex justify-end">
        <button
          type="submit"
          className="rounded-full border border-f1-cyan/40 px-6 py-2 text-xs uppercase tracking-[0.2em] text-f1-cyan"
        >
          Save Driver
        </button>
      </div>
    </form>
  );
}
