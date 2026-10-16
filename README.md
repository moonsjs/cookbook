# Cookbook — pola kanonik Moons

App contoh kecil yang memuat pola kanonik [`@moonsjs/*`](https://www.npmjs.com/org/moonsjs)
dan **dijalankan di CI**: query param + `Link search`, `refresh()` pasca-mutasi
(serverFn + revalidasi loader), validasi dua sisi (skema zod bersama), loader →
serverFn, dynamic route, `_404`/`_error` kustom, auth + CSRF, rate limit,
upload multipart di `src/api`, prerender/ISR, serta Tailwind v4 + komponen ala
shadcn/ui (Radix).

Resep agen menautkan file di repo ini sebagai sumber kebenaran:
<https://github.com/moonsjs/docs> (`ai/CONTEXT.md`, `ai/recipes/*`).
Dokumentasi situs: <https://docs.devmoon.net>

## Jalankan

```bash
bun install
bun run typegen   # tulis .moons/routes.d.ts + .moons/context.d.ts
bun run dev       # http://localhost:3000
```

Build produksi:

```bash
bun run build && bun run start
```

## Struktur singkat

- `src/routes/**` — halaman (`index`, `notes/[id]`, `dashboard`, `upload`, …)
  plus `_404.tsx` / `_error.tsx` kustom.
- `src/server/**` — `serverFn` (`notes.server.ts`, `info.server.ts`).
- `src/api/**` — endpoint HTTP mentah (`upload.ts`).
- `src/shared/**` — skema & helper lintas sisi (`schemas.ts`, `rate-limit.ts`).
- `test/**` — unit + `createTestServer` (loader → payload `searchParams`).
