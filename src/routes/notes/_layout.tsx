import type { ReactNode } from "react";

/**
 * Layout bersarang (B1): hanya berlaku untuk direktori `notes/` dan turunannya
 * (PRD §11.4 butir 4), dibungkus setelah layout root. E2E: skrip cookbook
 * memastikan marker ini tampil di `/notes/[id]` dan TIDAK di route lain.
 */
export default function NotesLayout(props: { children?: ReactNode }) {
  return (
    <section data-layout="notes">
      <p className="meta">notes section — nested layout (root → notes → page)</p>
      {props.children}
    </section>
  );
}
