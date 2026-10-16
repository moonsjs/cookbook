/** Logika murni di luar `src/routes/` supaya bisa diimpor test & route. */

export const ITEMS = ["alpha", "beta", "gamma", "delta"] as const;

export function filterItems(query: string): string[] {
  const needle = query.trim().toLowerCase();
  return ITEMS.filter((item) => item.includes(needle));
}
