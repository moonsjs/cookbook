import { Link, refresh, useLoaderData, type RouteMetaFn } from "@moonsjs/react";
import { useState } from "react";
import { addNote, listNotes } from "../server/notes.server";
import { addNoteInput } from "../shared/schemas";

/** Loader memanggil serverFn in-process saat SSR (tanpa HTTP, §7.4). */
export const loader = async () => ({
  notes: await listNotes({ input: {} }),
});

/** Addendum B.1: meta bertipe dari data loader (dipakai di `<title>`). */
export const meta: RouteMetaFn<typeof loader> = ({ data }) => ({
  title: `Mutate — ${data.notes.length} note${data.notes.length === 1 ? "" : "s"} — Cookbook`,
  description: "Example serverFn mutation + refresh() (Addendum A.3).",
});

export default function MutatePage() {
  const data = useLoaderData<typeof loader>();
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function submit(): Promise<void> {
    setError(null);

    // Validasi sisi client memakai schema yang sama dengan serverFn (§7.3).
    const parsed = addNoteInput.safeParse({ title });
    if (!parsed.success) {
      setError("Title must be 1–80 characters.");
      return;
    }

    try {
      await addNote({ input: parsed.data });
      // Addendum A.3: ambil data loader segar + render ulang tanpa reload penuh.
      refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    }
  }

  return (
    <section>
      <h1>Mutate</h1>
      <p className="meta">Add a note → `refresh()` → list re-rendered from the server.</p>
      <p>
        <input
          id="note-title"
          value={title}
          placeholder="note title"
          onChange={(event) => setTitle(event.target.value)}
        />{" "}
        <button id="note-add" type="button" onClick={() => void submit()}>
          Add
        </button>
      </p>
      {error !== null && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <ul id="note-list">
        {data.notes.map((note) => (
          <li key={note.id}>
            <Link to="/notes/[id]" params={{ id: note.id }}>
              {note.title}
            </Link>{" "}
            <span className="meta">({note.id})</span>
          </li>
        ))}
      </ul>
      {data.notes.length === 0 && <p className="meta">No notes yet.</p>}
    </section>
  );
}
