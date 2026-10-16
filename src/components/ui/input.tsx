import type { ComponentProps } from "react";
import { cn } from "../../shared/cn";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-9 rounded-md border border-slate-300 px-2 text-sm outline-none focus:border-slate-500",
        className,
      )}
      {...props}
    />
  );
}
