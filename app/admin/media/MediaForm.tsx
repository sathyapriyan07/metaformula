"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { mediaSchema } from "../../../lib/validators";
import type { Media } from "../../../types";
import { TextAreaField, TextField } from "../../../components/FormFields";
import ImagePreview from "../../admin/components/ImagePreview";

type MediaFormValues = z.input<typeof mediaSchema>;

export default function MediaForm({ initialData }: { initialData?: Media | null }) {
  const [status, setStatus] = useState<string | null>(null);
  const form = useForm<MediaFormValues>({
    resolver: zodResolver(mediaSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      url: initialData?.url ?? "",
      category: initialData?.category ?? "",
      caption: initialData?.caption ?? "",
    },
  });

  const onSubmit = async (values: MediaFormValues) => {
    setStatus(null);
    const method = initialData ? "PUT" : "POST";
    const endpoint = initialData ? `/api/media/${initialData.id}` : "/api/media";
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

  const previewUrl = form.watch("url");

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
      <TextField label="Title" name="title" register={form.register} error={form.formState.errors.title} />
      <TextField label="Category" name="category" register={form.register} error={form.formState.errors.category} />
      <div className="md:col-span-2">
        <TextField label="Media URL (https://)" name="url" register={form.register} error={form.formState.errors.url} />
      </div>
      <div className="md:col-span-2">
        <TextAreaField label="Caption" name="caption" register={form.register} error={form.formState.errors.caption} />
      </div>
      <div className="md:col-span-2">
        <ImagePreview url={previewUrl} />
      </div>
      {status && <p className="md:col-span-2 text-sm text-f1-cyan">{status}</p>}
      <div className="md:col-span-2 flex justify-end">
        <button
          type="submit"
          className="rounded-full border border-f1-cyan/40 px-6 py-2 text-xs uppercase tracking-[0.2em] text-f1-cyan"
        >
          Save Media
        </button>
      </div>
    </form>
  );
}
