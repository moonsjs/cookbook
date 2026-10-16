import { Link } from "@moonsjs/react";
import { POSTS } from "../../shared/posts";

/** D.5: halaman statis — dirender saat `moons build`/`check`. */
export const prerender = true;

export default function BlogIndex() {
  return (
    <section>
      <h1>Blog</h1>
      <p className="meta">SSG: static files in dist/client/blog/** (Addendum D.5).</p>
      <ul>
        {POSTS.map((post) => (
          <li key={post.slug}>
            <Link to="/blog/[slug]" params={{ slug: post.slug }}>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
