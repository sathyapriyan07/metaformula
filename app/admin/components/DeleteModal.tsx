"use client";

import { useEffect } from "react";

export default function DeleteModal({
  open,
  onCancel,
  onConfirm,
  title,
  message,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    if (open) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="glass-strong w-full max-w-md rounded-2xl p-6">
        <h2 className="font-display text-2xl tracking-[0.2em] text-white">{title}</h2>
        <p className="mt-3 text-sm text-f1-muted">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-f1-muted"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-full border border-f1-red/60 px-4 py-2 text-xs uppercase tracking-[0.2em] text-f1-red"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
