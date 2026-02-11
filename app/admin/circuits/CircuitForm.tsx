"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { circuitSchema } from "../../../lib/validators";
import type { Circuit } from "../../../types";
import { TextField } from "../../../components/FormFields";
import ImagePreview from "../../admin/components/ImagePreview";

type CircuitFormValues = z.input<typeof circuitSchema>;

export default function CircuitForm({ initialData }: { initialData?: Circuit | null }) {
  const [status, setStatus] = useState<string | null>(null);
  const form = useForm<CircuitFormValues>({
    resolver: zodResolver(circuitSchema),
    defaultValues: {
      circuit_name: initialData?.circuit_name ?? "",
      country: initialData?.country ?? "",
      track_layout_url: initialData?.track_layout_url ?? "",
      lap_length_km: initialData?.lap_length_km?.toString() ?? "",
      first_gp_year: initialData?.first_gp_year?.toString() ?? "",
    },
  });

  const onSubmit = async (values: CircuitFormValues) => {
    setStatus(null);
    const method = initialData ? "PUT" : "POST";
    const endpoint = initialData ? `/api/circuits/${initialData.id}` : "/api/circuits";
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

  const layoutUrl = form.watch("track_layout_url");

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
      <TextField label="Circuit Name" name="circuit_name" register={form.register} error={form.formState.errors.circuit_name} />
      <TextField label="Country" name="country" register={form.register} error={form.formState.errors.country} />
      <TextField
        label="Lap Length (km)"
        name="lap_length_km"
        type="number"
        step="0.001"
        register={form.register}
        error={form.formState.errors.lap_length_km}
      />
      <TextField label="First GP Year" name="first_gp_year" register={form.register} error={form.formState.errors.first_gp_year} />
      <div className="md:col-span-2">
        <TextField label="Track Layout URL (https://)" name="track_layout_url" register={form.register} error={form.formState.errors.track_layout_url} />
      </div>
      <div className="md:col-span-2">
        <ImagePreview url={layoutUrl} />
      </div>
      {status && <p className="md:col-span-2 text-sm text-f1-cyan">{status}</p>}
      <div className="md:col-span-2 flex justify-end">
        <button
          type="submit"
          className="rounded-full border border-f1-cyan/40 px-6 py-2 text-xs uppercase tracking-[0.2em] text-f1-cyan"
        >
          Save Circuit
        </button>
      </div>
    </form>
  );
}
