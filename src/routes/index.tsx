import { useLoaderData } from "@moonsjs/react";
import { whoami } from "../server/info.server";

/** Loader boleh mengembalikan Date/Map/Set — devalue menjaga tipenya (§17). */
export const loader = async () => ({
  generatedAt: new Date("2026-10-14T00:00:00Z"),
  requestId: (await whoami({ input: {} })).requestId,
  patterns: new Map<string, string>([
    ["search", "Query param + useSearchParams + Link search"],
    ["mutate", "serverFn + refresh() after mutation"],
    ["guard", "Two-sided validation (same schema) + server error"],
    ["session", "Cookie → ctx → DB (Drizzle), minimal auth (A3)"],
    ["login", "serverFn login + setCookie (D.2)"],
    ["dashboard", "CRUD + Drizzle (Stage 3)"],
    ["blog", "SSG prerender (D.5)"],
    ["notes/[id]", "Dynamic route + loader calls serverFn in-process"],
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
        Quick verification: <code>moons check</code> (typegen → tsc → build).
      </p>
    </section>
  );
}
