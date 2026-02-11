import { ReactNode } from "react";
import clsx from "clsx";

export default function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={clsx(
        "glass-strong fade-in-up rounded-2xl p-5 transition-all duration-200 hover:scale-[1.02] hover:border-f1-cyan/40 hover:shadow-neon overflow-hidden max-w-full",
        className
      )}
    >
      {children}
    </div>
  );
}
