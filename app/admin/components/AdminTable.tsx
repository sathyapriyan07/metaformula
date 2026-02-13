"use client";
import { ReactNode } from "react";

export interface Column<T> {
  key: keyof T;
  label: string;
}

export default function AdminTable<T extends { id: number }>({
  columns,
  rows,
  actions,
}: {
  columns: Column<T>[];
  rows: T[];
  actions?: (row: T) => ReactNode;
}) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block glass-strong overflow-x-auto rounded-xl p-4">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-white/50">
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)} className="pb-3">
                  {col.label}
                </th>
              ))}
              {actions && <th className="pb-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-white/10">
                {columns.map((col) => (
                  <td key={String(col.key)} className="py-3 text-white/70">
                    {(row as Record<string, ReactNode>)[col.key as string] ?? "—"}
                  </td>
                ))}
                {actions && <td className="py-3 text-right">{actions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <div className="py-10 text-center text-white/50">No records yet.</div>}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="glass-strong rounded-xl p-4 space-y-3">
            {columns.map((col) => (
              <div key={String(col.key)}>
                <div className="text-xs uppercase tracking-wider text-white/50 mb-1">
                  {col.label}
                </div>
                <div className="text-sm text-white/70">
                  {(row as Record<string, ReactNode>)[col.key as string] ?? "—"}
                </div>
              </div>
            ))}
            {actions && (
              <div className="pt-2 border-t border-white/10">
                {actions(row)}
              </div>
            )}
          </div>
        ))}
        {!rows.length && (
          <div className="glass-strong rounded-xl p-8 text-center text-white/50">
            No records yet.
          </div>
        )}
      </div>
    </>
  );
}
