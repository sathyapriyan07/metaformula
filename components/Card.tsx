import { ReactNode } from "react";
import clsx from "clsx";

export default function Card({ children, className, variant = "f1" }: { children: ReactNode; className?: string; variant?: "f1" | "glass" }) {
  return (
    <div
      className={clsx(
        variant === "glass" 
          ? "glass rounded-2xl p-6 hover:scale-[1.02]" 
          : "f1-panel-hover rounded-lg p-6 hover:scale-[1.03]",
        className
      )}
    >
      {children}
    </div>
  );
}
