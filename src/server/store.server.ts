// Server-only (§12): isi file ini tidak pernah dikirim ke client — hanya stub
// serverFn dari `notes.server.ts` yang sampai ke browser.
export const CANARY = "MOONS_COOKBOOK_CANARY_4e8b12";
export const FAKE_SECRET = "cookbook-fake-secret-should-not-leak";

export interface Note {
  id: string;
  title: string;
  createdAt: Date;
}

const notes = new Map<string, Note>();
let counter = 0;

/** Id deterministik (urutan `n1`, `n2`, …) — memudahkan test. */
export function nextNoteId(): string {
  counter += 1;
  return `n${counter}`;
}

export function insertNote(note: Note): void {
  notes.set(note.id, note);
}

export function getNote(id: string): Note | undefined {
  return notes.get(id);
}

export function allNotes(): Note[] {
  return [...notes.values()].sort((a, b) => a.id.localeCompare(b.id));
}
