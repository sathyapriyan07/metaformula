"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { TimelineEvent } from "../../../types";
import { timelineEventSchema } from "../../../lib/validators";
import { TextAreaField, TextField } from "../../../components/FormFields";
import ImagePreview from "../components/ImagePreview";

type TimelineFormValues = z.input<typeof timelineEventSchema>;

export default function TimelineForm({ initialData }: { initialData?: TimelineEvent | null }) {
  const [status, setStatus] = useState<string | null>(null);
  const form = useForm<TimelineFormValues>({
    resolver: zodResolver(timelineEventSchema),
    defaultValues: {
      year: initialData?.year?.toString() ?? "",
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      image_url: initialData?.image_url ?? "",
    },
  });

  const imageUrl = form.watch("image_url");

  const onSubmit = async (values: TimelineFormValues) => {
    setStatus(null);
    const method = initialData ? "PUT" : "POST";
    const endpoint = initialData ? `/api/timeline/${initialData.id}` : "/api/timeline";
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
      <TextField label="Year" name="year" type="number" register={form.register} error={form.formState.errors.year} />
      <TextField label="Title" name="title" register={form.register} error={form.formState.errors.title} />
      <div className="md:col-span-2">
        <TextAreaField
          label="Description"
          name="description"
          register={form.register}
          error={form.formState.errors.description}
          placeholder="Era-defining summary..."
        />
      </div>
      <div className="md:col-span-2">
        <TextField label="Image URL (https://)" name="image_url" register={form.register} error={form.formState.errors.image_url} />
      </div>
      <div className="md:col-span-2">
        <ImagePreview url={imageUrl} />
      </div>
      {status ? <p className="md:col-span-2 text-sm text-f1-cyan">{status}</p> : null}
      <div className="md:col-span-2 flex justify-end">
        <button
          type="submit"
          className="rounded-full border border-f1-cyan/40 px-6 py-2 text-xs uppercase tracking-[0.2em] text-f1-cyan"
        >
          Save Event
        </button>
      </div>
    </form>
  );
}
