import { env, serverFn, setCookie } from "@moonsjs/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, users } from "./db.server";

/**
 * Auth contoh (Tahap 3): cookie sesi diset lewat helper D.2 (`setCookie`),
 * user tersimpan di Drizzle (`users`). Guard di serverFn membaca `ctx`.
 */
export const login = serverFn({
  input: z.object({ name: z.string().min(1).max(40) }),
  output: z.object({ id: z.number(), name: z.string(), created: z.boolean() }),
  handler: async ({ input }) => {
    const existing = db.select().from(users).where(eq(users.name, input.name)).get();
    const created = existing === undefined;
    const user =
      existing ??
      db
        .insert(users)
        .values({ name: input.name, createdAt: new Date().toISOString() })
        .returning()
        .get();

    // Cookie sesi: HttpOnly + SameSite (lihat panduan Auth & CSRF).
    setCookie("demo_user", user.name, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return { id: user.id, name: user.name, created };
  },
});

export const me = serverFn({
  input: z.object({}),
  output: z
    .object({ id: z.number(), name: z.string(), createdAt: z.string() })
    .nullable(),
  handler: async ({ ctx }) => {
    if (ctx.demoUser === null) {
      return null;
    }
    const user = db.select().from(users).where(eq(users.name, ctx.demoUser)).get();
    return user ?? null;
  },
});

export const whoamiToken = serverFn({
  input: z.object({}),
  output: z.string(),
  // Demonstrasi env() rahasia di serverFn: tidak pernah dikirim ke client.
  handler: async () => env<string>("COOKBOOK_PREFIX") || "hi",
});
