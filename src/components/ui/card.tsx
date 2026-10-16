import type { ComponentProps } from "react";
import { cn } from "../../shared/cn";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("rounded-lg border border-slate-200 bg-white p-4 shadow-sm", className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentProps<"h2">) {
  return <h2 className={cn("text-base font-semibold", className)} {...props} />;
}
