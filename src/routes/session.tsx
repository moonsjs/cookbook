import { Link, useLoaderData } from "@moonsjs/react";
import { me } from "../server/auth.server";

/**
 * Pola auth minimum (A3 + Tahap 3): cookie sesi → `ctx` → query DB (Drizzle).
 * Cookie di-set oleh serverFn `login` lewat helper D.2 (`setCookie`).
 */
export const loader = async () => ({ user: await me({ input: {} }) });

export default function SessionPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <section>
      <h1>Session</h1>
      <p data-user={data.user?.name ?? "none"}>
        {data.user === null ? "belum login" : `hai, ${data.user?.name}!`}
      </p>
      {data.user !== null ? (
        <p className="meta">
          db: user #{data.user?.id} · dibuat {data.user?.createdAt}
        </p>
      ) : null}
      <p className="meta">
        Masuk lewat <Link to="/login">/login</Link> — serverFn men-set cookie HttpOnly
        (helper D.2), user disimpan di Drizzle (`users`).
      </p>
    </section>
  );
}
