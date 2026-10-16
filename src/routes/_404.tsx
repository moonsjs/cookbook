import { Link } from "@moonsjs/react";

/** Halaman 404 kustom (root-only) — dirender standalone oleh runtime. */
export default function NotFound() {
  return (
    <div className="shell">
      <h1>404 — Halaman tidak ditemukan</h1>
      <p className="meta">URL yang Anda buka tidak terdaftar di router file-based.</p>
      <p>
        <Link to="/">Kembali ke Cookbook</Link>
      </p>
    </div>
  );
}
