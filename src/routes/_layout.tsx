import { Link } from "@moonsjs/react";
import type { ReactNode } from "react";

/** Layout bersama (root) — dibungkus otomatis untuk semua page di bawahnya (§11.1). */
export default function Layout(props: { children?: ReactNode }) {
  return (
    <div className="shell">
      <nav className="nav">
        <Link to="/">home</Link>
        <Link to="/search">search</Link>
        <Link to="/mutate">mutate</Link>
        <Link to="/guard">guard</Link>
        <Link to="/session">session</Link>
        <Link to="/login">login</Link>
        <Link to="/dashboard">dashboard</Link>
        <Link to="/blog">blog</Link>
      </nav>
      <main>{props.children}</main>
    </div>
  );
}
