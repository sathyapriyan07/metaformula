export function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between text-sm text-f1-muted">
      <span>{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}
