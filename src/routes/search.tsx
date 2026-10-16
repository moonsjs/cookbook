import { Link, useLoaderData, useSearchParams, type LoaderArgs } from "@moonsjs/react";
import { ITEMS, filterItems } from "../shared/search";

/** Loader membaca query param dari `req.url` (server-side). */
export const loader = async ({ req }: LoaderArgs<"/search">) => {
  const q = new URL(req.url).searchParams.get("q") ?? "";
  return { q, results: filterItems(q) };
};

export default function SearchPage() {
  const data = useLoaderData<typeof loader>();
  // Nilai identik dengan loader (di-embed ke payload SSR — Addendum A.3).
  const searchParams = useSearchParams();
  const activeQuery = searchParams["q"] ?? "";

  return (
    <section>
      <h1>Search</h1>
      <div className="toolbar">
        <Link to="/search" search={{ q: undefined }}>
          semua
        </Link>
        {ITEMS.map((item) => (
          <Link key={item} to="/search" search={{ q: item }}>
            {item}
          </Link>
        ))}
      </div>
      <p className="meta">
        query (useSearchParams) = <b>{activeQuery || "-"}</b> · query (loader) ={" "}
        <b>{data.q || "-"}</b>
      </p>
      <ul>
        {data.results.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {data.results.length === 0 && <p>Tidak ada hasil untuk “{data.q}”.</p>}
    </section>
  );
}
