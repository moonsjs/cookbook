import { Link, notFound, useLoaderData, type LoaderArgs, type RouteMetaFn } from "@moonsjs/react";
import { noteById } from "../../server/notes.server";

/** Dynamic route: `params.id` dari segmen `[id]`; serverFn dipanggil in-process. */
export const loader = async ({ params }: LoaderArgs<"/notes/[id]">) => ({
  note: await noteById({ input: { id: params.id } }),
});

/** Addendum B.1: `meta` dieksekusi server-side dan ikut ke payload/title. */
export const meta: RouteMetaFn<typeof loader> = ({ data }) =>
  data.note === null
    ? { title: "Note not found — Cookbook" }
    : { title: `${data.note.title} — Cookbook`, description: "Contoh dynamic route + meta." };

export default function NotePage() {
  const data = useLoaderData<typeof loader>();

  if (data.note === null) {
    // Addendum B.2: sinyal notFound → render `_404` dengan status 404.
    notFound();
  }

  return (
    <section>
      <h1>{data.note.title}</h1>
      <p className="meta">
        id {data.note.id} · dibuat {data.note.createdAt.toISOString()}
      </p>
      <Link to="/mutate">Kembali ke daftar</Link>
    </section>
  );
}
