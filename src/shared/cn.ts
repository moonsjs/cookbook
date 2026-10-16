import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Helper `cn` ala shadcn/ui (clsx + tailwind-merge). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
