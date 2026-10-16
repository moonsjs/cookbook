import { useLoaderData } from "@moonsjs/react";
import { whoami } from "../server/info.server";

/** Loader boleh mengembalikan Date/Map/Set — devalue menjaga tipenya (§17). */
export const loader = async () => ({
  generatedAt: new Date("2026-10-14T00:00:00Z"),
  requestId: (await whoami({ input: {} })).requestId,
  patterns: new Map<string, string>([
    ["search", "Query param + useSearchParams + Link search"],
    ["mutate", "serverFn + refresh() pasca-mutasi"],
    ["guard", "Validasi dua sisi (schema yang sama) + error server"],
    ["session", "Cookie → ctx → DB (Drizzle), auth minimum (A3)"],
    ["login", "serverFn login + setCookie (D.2)"],
    ["dashboard", "CRUD + Drizzle (Tahap 3)"],
    ["blog", "SSG prerender (D.5)"],
    ["notes/[id]", "Dynamic route + loader memanggil serverFn in-process"],
  ]),
});

export default function IndexPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <section>
      <h1>Moons Cookbook</h1>
      <p className="meta">
        Generated {data.generatedAt.toISOString()} · request {data.requestId}
      </p>
      <ul>
        {[...data.patterns].map(([name, description]) => (
          <li key={name}>
            <code>{name}</code> — {description}
          </li>
        ))}
      </ul>
      <p className="meta">
        Verifikasi cepat: <code>moons check</code> (typegen → tsc → build).
      </p>
    </section>
  );
}
