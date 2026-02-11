"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { teamSchema } from "../../../lib/validators";
import type { Team } from "../../../types";
import { TextField } from "../../../components/FormFields";
import ImagePreview from "../../admin/components/ImagePreview";

type TeamFormValues = z.input<typeof teamSchema>;

export default function TeamForm({ initialData }: { initialData?: Team | null }) {
  const [status, setStatus] = useState<string | null>(null);
  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      team_name: initialData?.team_name ?? "",
      logo_url: initialData?.logo_url ?? "",
      base_country: initialData?.base_country ?? "",
      championships: initialData?.championships?.toString() ?? "0",
      active_years: initialData?.active_years ?? "",
    },
  });

  const onSubmit = async (values: TeamFormValues) => {
    setStatus(null);
    const method = initialData ? "PUT" : "POST";
    const endpoint = initialData ? `/api/teams/${initialData.id}` : "/api/teams";
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

  const logoUrl = form.watch("logo_url");

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
      <TextField label="Team Name" name="team_name" register={form.register} error={form.formState.errors.team_name} />
      <TextField label="Base Country" name="base_country" register={form.register} error={form.formState.errors.base_country} />
      <TextField label="Championships" name="championships" type="number" register={form.register} error={form.formState.errors.championships} />
      <TextField label="Active Years" name="active_years" register={form.register} error={form.formState.errors.active_years} />
      <div className="md:col-span-2">
        <TextField label="Logo URL (https://)" name="logo_url" register={form.register} error={form.formState.errors.logo_url} />
      </div>
      <div className="md:col-span-2">
        <ImagePreview url={logoUrl} />
      </div>
      {status && <p className="md:col-span-2 text-sm text-f1-cyan">{status}</p>}
      <div className="md:col-span-2 flex justify-end">
        <button
          type="submit"
          className="rounded-full border border-f1-cyan/40 px-6 py-2 text-xs uppercase tracking-[0.2em] text-f1-cyan"
        >
          Save Team
        </button>
      </div>
    </form>
  );
}
