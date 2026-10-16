import { z } from "zod";

/** Schema bersama: dipakai validasi client DAN serverFn (satu sumber kebenaran). */

export const addNoteInput = z.object({
  title: z.string().min(1).max(80),
});

export const greetInput = z.object({
  name: z.string().min(1).max(40),
});

/**
 * Schema output serverFn: WAJIB inline atau impor dari modul lain — deklarasi
 * lokal di `*.server.ts` ditolak build (`E_SCHEMA_LOCAL_REF`, decisions/0016).
 */
export const noteSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.date(),
});

export const noteListSchema = z.array(noteSchema);
