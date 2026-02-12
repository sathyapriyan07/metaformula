export function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-white/80">
      {children}
    </span>
  );
}
