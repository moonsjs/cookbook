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
  title: `Mutate — ${data.notes.length} catatan — Cookbook`,
  description: "Contoh mutasi serverFn + refresh() (Addendum A.3).",
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
      setError("Judul harus 1–80 karakter.");
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
      <p className="meta">Tambah catatan → `refresh()` → daftar dirender ulang dari server.</p>
      <p>
        <input
          id="note-title"
          value={title}
          placeholder="judul catatan"
          onChange={(event) => setTitle(event.target.value)}
        />{" "}
        <button id="note-add" type="button" onClick={() => void submit()}>
          Tambah
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
      {data.notes.length === 0 && <p className="meta">Belum ada catatan.</p>}
    </section>
  );
}
