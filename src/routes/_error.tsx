import { Link, useRouteError } from "@moonsjs/react";

/** Error boundary root (root-only) — `useRouteError()` menerima error dev. */
export default function RouteError() {
  const error = useRouteError();
  const label =
    error instanceof Error
      ? error.message
      : "Internal error (production does not send details).";

  return (
    <div className="shell">
      <h1>Something went wrong</h1>
      <pre className="error" role="alert" style={{ whiteSpace: "pre-wrap" }}>
        {label}
      </pre>
      <p className="meta">
        <Link to="/">Try again from Cookbook</Link>
      </p>
    </div>
  );
}
