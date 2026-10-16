import { refresh, useLoaderData } from "@moonsjs/react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { login, me } from "../server/auth.server";

/** Login contoh: serverFn + setCookie (D.2) + refresh() (A.3). */
export const loader = async () => ({ user: await me({ input: {} }) });

export default function LoginPage() {
  const data = useLoaderData<typeof loader>();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function submit(): Promise<void> {
    setError(null);
    const trimmed = name.trim();
    if (trimmed.length === 0 || trimmed.length > 40) {
      setError("Nama harus 1–40 karakter.");
      return;
    }
    try {
      await login({ input: { name: trimmed } });
      refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    }
  }

  return (
    <section>
      <h1>Login</h1>
      <p data-user={data.user?.name ?? "none"}>
        status: {data.user === null ? "belum login" : `login sebagai ${data.user?.name}`}
      </p>
      <p>
        <input
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
          placeholder="nama"
        />
        <Button onClick={submit}>Masuk</Button>
      </p>
      {error !== null ? <p role="alert">{error}</p> : null}
    </section>
  );
}
