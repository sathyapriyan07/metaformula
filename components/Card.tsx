import { ReactNode } from "react";
import clsx from "clsx";

export default function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={clsx(
        "glass rounded-2xl p-6 hover:scale-[1.02] hover:shadow-glow-hover",
        className
      )}
    >
      {children}
    </div>
  );
}
