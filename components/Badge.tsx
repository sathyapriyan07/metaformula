export function Badge({ children, variant = "default" }: { children: string; variant?: "default" | "red" }) {
  return (
    <span className={`inline-flex rounded px-3 py-1 text-xs font-bold tracking-f1 uppercase ${
      variant === "red" 
        ? "bg-f1-red text-white" 
        : "bg-white/10 text-white/80"
    }`}>
      {children}
    </span>
  );
}
