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
        {data.user === null ? "not logged in" : `hi, ${data.user?.name}!`}
      </p>
      {data.user !== null ? (
        <p className="meta">
          db: user #{data.user?.id} · created {data.user?.createdAt}
        </p>
      ) : null}
      <p className="meta">
        Sign in via <Link to="/login">/login</Link> — the serverFn sets an HttpOnly cookie
        (helper D.2); the user is stored in Drizzle (`users`).
      </p>
    </section>
  );
}
