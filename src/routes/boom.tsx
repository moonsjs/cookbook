import type { LoaderArgs } from "@moonsjs/react";

/** Test hook (test-hydration): `?boom=1` melempar di loader → halaman `_error`. */
export const loader = async ({ req }: LoaderArgs<"/boom">) => {
  if (new URL(req.url).searchParams.get("boom") === "1") {
    throw new Error("Simulated loader failure (cookbook)");
  }
  return {};
};

export default function BoomPage() {
  return <p>loader ok</p>;
}
