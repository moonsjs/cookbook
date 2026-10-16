import { expect, test } from "bun:test";
import { scanRoutes, type MoonsConfig, type RouteModule } from "@moonsjs/core";
import { createTestServer } from "@moonsjs/vite/server";
import { join } from "node:path";
import { addNoteInput, greetInput } from "../src/shared/schemas";
import { filterItems } from "../src/shared/search";
import { allNotes, getNote, insertNote, nextNoteId } from "../src/server/store.server";

test("filterItems: kosong = semua, substring case-insensitive", () => {
  expect(filterItems("")).toEqual(["alpha", "beta", "gamma", "delta"]);
  expect(filterItems("AL")).toEqual(["alpha"]);
  expect(filterItems("zzz")).toEqual([]);
});

test("schema bersama menolak input kosong (validasi dua sisi)", () => {
  expect(addNoteInput.safeParse({ title: "" }).success).toBe(false);
  expect(addNoteInput.safeParse({ title: "ok" }).success).toBe(true);
  expect(greetInput.safeParse({ name: "" }).success).toBe(false);
});

test("store server: insert/get/list deterministik", () => {
  const before = allNotes().length;
  const id = nextNoteId();
  insertNote({ id, title: `note-${id}`, createdAt: new Date("2026-10-14T00:00:00Z") });

  expect(getNote(id)?.title).toBe(`note-${id}`);
  expect(allNotes()).toHaveLength(before + 1);
});

test("createTestServer: /search?q=alp menyaring lewat loader + payload searchParams", async () => {
  const routesDir = join(import.meta.dir, "..", "src", "routes");
  const routes = scanRoutes(routesDir);
  const config: MoonsConfig = {
    routesDir: "src/routes",
    context: async () => ({ requestId: "test", url: "" }),
  };
  const loadRoute: Record<string, () => Promise<RouteModule>> = {
    _layout: async () => (await import("../src/routes/_layout")) as unknown as RouteModule,
    search: async () => (await import("../src/routes/search")) as unknown as RouteModule,
  };

  const server = createTestServer({ routes, config, routesDir, loadRoute });
  const response = await server.fetch("/search?q=alp");
  const body = await response.text();

  expect(response.status).toBe(200);
  expect(body).toContain("alpha");
  expect(body).toContain("searchParams");
  expect(body).not.toContain("<li>gamma</li>");
});
