import { Link } from "@moonsjs/react";

/** Halaman 404 kustom (root-only) — dirender standalone oleh runtime. */
export default function NotFound() {
  return (
    <div className="shell">
      <h1>404 — Page not found</h1>
      <p className="meta">The URL you opened is not registered in the file-based router.</p>
      <p>
        <Link to="/">Back to Cookbook</Link>
      </p>
    </div>
  );
}
