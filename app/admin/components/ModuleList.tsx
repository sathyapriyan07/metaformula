"use client";

import { useState } from "react";
import Link from "next/link";
import AdminTable, { Column } from "./AdminTable";
import DeleteModal from "./DeleteModal";

interface ModuleListProps<T extends { id: number }> {
  initialRows: T[];
  columns: Column<T>[];
  modulePath: string;
  moduleApi: string;
}

export default function ModuleList<T extends { id: number }>({
  initialRows,
  columns,
  modulePath,
  moduleApi,
}: ModuleListProps<T>) {
  const [rows, setRows] = useState<T[]>(initialRows);
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      const response = await fetch(`${moduleApi}/${pendingDelete.id}`, { method: "DELETE" });
      if (!response.ok) return;
      setRows((prev) => prev.filter((row) => row.id !== pendingDelete.id));
    } catch {
      return;
    }
    setPendingDelete(null);
  };

  return (
    <>
      <AdminTable
        columns={columns}
        rows={rows}
        actions={(row) => (
          <div className="flex justify-end gap-2">
            <Link
              href={`${modulePath}/${row.id}`}
              className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white"
            >
              Edit
            </Link>
            <button
              onClick={() => setPendingDelete(row)}
              className="rounded-full border border-f1-red/60 px-3 py-1 text-xs uppercase tracking-[0.2em] text-f1-red"
            >
              Delete
            </button>
          </div>
        )}
      />
      <DeleteModal
        open={!!pendingDelete}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
        title="Delete record?"
        message="This action is permanent and will remove the record from the archive."
      />
    </>
  );
}
