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
          <div className="flex gap-2 md:justify-end">
            <Link
              href={`${modulePath}/${row.id}`}
              className="flex-1 md:flex-none rounded-lg border border-white/20 px-3 py-1.5 text-xs uppercase tracking-wider text-white text-center hover:bg-white/5 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={() => setPendingDelete(row)}
              className="flex-1 md:flex-none rounded-lg border border-red-600/60 px-3 py-1.5 text-xs uppercase tracking-wider text-red-500 hover:bg-red-600/10 transition-colors"
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
