export function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex rounded-full border border-f1-cyan/40 bg-f1-cyan/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-f1-cyan shadow-neon">
      {children}
    </span>
  );
}
