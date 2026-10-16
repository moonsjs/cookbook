import { useState } from "react";
import { greetFromEnv } from "../server/notes.server";
import { greetInput } from "../shared/schemas";

/**
 * Validasi dua sisi: `safeParse` di client (feedback instan) + schema yang sama
 * divalidasi ulang di serverFn (sumber kebenaran — client bisa dilewati user).
 */
export default function GuardPage() {
  const [name, setName] = useState("moons");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(bypassClientValidation: boolean): Promise<void> {
    setResult(null);
    setError(null);

    if (!bypassClientValidation) {
      const parsed = greetInput.safeParse({ name });
      if (!parsed.success) {
        setError("Client check: name must be 1–40 characters (server not touched yet).");
        return;
      }
    }

    try {
      const message = await greetFromEnv({ input: { name: bypassClientValidation ? "" : name } });
      setResult(message);
    } catch (caught) {
      // Error validasi server memakai format §15 (code + saran) — tampilkan apa adanya.
      setError(caught instanceof Error ? caught.message : String(caught));
    }
  }

  return (
    <section>
      <h1>Guard</h1>
      <p className="meta">
        `env()` only lives in `.server.ts`; input is re-validated on the server (E_INPUT_INVALID).
      </p>
      <p>
        <input
          id="greet-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />{" "}
        <button id="greet-send" type="button" onClick={() => void submit(false)}>
          Send
        </button>{" "}
        <button id="greet-bypass" type="button" onClick={() => void submit(true)}>
          Bypass client check
        </button>
      </p>
      {result !== null && (
        <p className="okmsg" role="status">
          {result}
        </p>
      )}
      {error !== null && (
        <pre className="error" role="alert" style={{ whiteSpace: "pre-wrap" }}>
          {error}
        </pre>
      )}
    </section>
  );
}
