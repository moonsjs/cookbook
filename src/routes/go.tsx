import { redirect, type LoaderArgs } from "@moonsjs/react";

/**
 * Contoh `redirect()` (Addendum B.2): `/go?to=/mutate` → 303 ke `/mutate`
 * (hanya path internal, bukan open redirect).
 */
export const loader = async ({ req }: LoaderArgs<"/go">) => {
  const to = new URL(req.url).searchParams.get("to") ?? "/";
  redirect(to.startsWith("/") && !to.startsWith("//") ? to : "/", 303);
};

export default function GoPage() {
  return <p>Mengalihkan…</p>;
}
