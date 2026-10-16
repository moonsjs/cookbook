/** Data blog contoh (Tahap 3) — client-safe (dipakai halaman & `paths`). */
export interface Post {
  slug: string;
  title: string;
  body: string;
}

export const POSTS: readonly Post[] = [
  {
    slug: "hello",
    title: "Halo dari blog statis",
    body: "Halaman ini di-prerender saat build (D.5) dan dilayani sebagai file HTML.",
  },
  {
    slug: "kedua",
    title: "Catatan kedua",
    body: "Tambah post → tambah file di dist/client/blog/<slug>/index.html.",
  },
];

export function postBySlug(slug: string): Post | undefined {
  return POSTS.find((post) => post.slug === slug);
}
