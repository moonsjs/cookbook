import { Link, useRouteError } from "@moonsjs/react";

/** Error boundary root (root-only) — `useRouteError()` menerima error dev. */
export default function RouteError() {
  const error = useRouteError();
  const label =
    error instanceof Error
      ? error.message
      : "Terjadi kesalahan internal (production tidak mengirim detail).";

  return (
    <div className="shell">
      <h1>Terjadi kesalahan</h1>
      <pre className="error" role="alert" style={{ whiteSpace: "pre-wrap" }}>
        {label}
      </pre>
      <p className="meta">
        <Link to="/">Coba lagi dari Cookbook</Link>
      </p>
    </div>
  );
}
