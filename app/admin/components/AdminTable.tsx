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
    <div className="glass-strong overflow-x-auto rounded-2xl p-4">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead className="text-xs uppercase tracking-[0.2em] text-f1-muted">
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
                <td key={String(col.key)} className="py-3 text-f1-muted">
                  {(row as Record<string, ReactNode>)[col.key as string] ?? "—"}
                </td>
              ))}
              {actions && <td className="py-3 text-right">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && <div className="py-10 text-center text-f1-muted">No records yet.</div>}
    </div>
  );
}
