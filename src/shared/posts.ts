/** Data blog contoh (Tahap 3) — client-safe (dipakai halaman & `paths`). */
export interface Post {
  slug: string;
  title: string;
  body: string;
}

export const POSTS: readonly Post[] = [
  {
    slug: "hello",
    title: "Hello from the static blog",
    body: "This page is prerendered at build time (D.5) and served as an HTML file.",
  },
  {
    slug: "kedua",
    title: "Second post",
    body: "Add a post → add a file at dist/client/blog/<slug>/index.html.",
  },
];

export function postBySlug(slug: string): Post | undefined {
  return POSTS.find((post) => post.slug === slug);
}
