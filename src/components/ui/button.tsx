import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../shared/cn";

/**
 * Button ala shadcn/ui (Tahap 3): cva + `cn`, tanpa Radix.
 * Komponen Radix (Dialog, Dropdown, …) bisa ditambahkan lewat CLI shadcn —
 * polanya sama (lihat resep `docs/ai/recipes/shadcn-ui.md`).
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white hover:bg-slate-700",
        outline: "border border-slate-300 hover:bg-slate-100",
        destructive: "bg-red-600 text-white hover:bg-red-500",
      },
      size: { sm: "h-8", md: "h-9" },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
