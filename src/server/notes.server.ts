import { env, serverFn } from "@moonsjs/server";
import { z } from "zod";
import { addNoteInput, greetInput, noteListSchema, noteSchema } from "../shared/schemas";
import { CANARY, FAKE_SECRET, allNotes, getNote, insertNote, nextNoteId } from "./store.server";

// Referensi kanari memastikan isi file ini tetap "hidup" di server dan tidak
// pernah ikut ke bundle client (dicek scripts/cookbook/test-cookbook.sh).
if (CANARY.length === 0 || FAKE_SECRET.length === 0) {
  throw new Error("unreachable");
}

/** Baca daftar catatan (dipanggil loader maupun client — lihat routes/mutate.tsx). */
export const listNotes = serverFn({
  input: z.object({}),
  output: noteListSchema,
  handler: async () => allNotes(),
});

/** Tambah catatan; judul divalidasi dua sisi (schema yang sama di client & server). */
export const addNote = serverFn({
  input: addNoteInput,
  output: noteSchema,
  handler: async ({ input }) => {
    const note = { id: nextNoteId(), title: input.title, createdAt: new Date() };
    insertNote(note);
    return note;
  },
});

/** Loader dynamic route memanggil serverFn in-process saat SSR (§7.4). */
export const noteById = serverFn({
  input: z.object({ id: z.string().min(1) }),
  output: noteSchema.nullable(),
  handler: async ({ input }) => getNote(input.id) ?? null,
});

/** `env()` hanya legal di server (§7.5); kalau diset, dipakai sebagai sapaan. */
export const greetFromEnv = serverFn({
  input: greetInput,
  output: z.string(),
  handler: async ({ input }) => {
    const prefix = env<string>("COOKBOOK_PREFIX") || "halo";
    return `${prefix}, ${input.name}! (req ${env<string>("COOKBOOK_REQ") || "-"})`;
  },
});
