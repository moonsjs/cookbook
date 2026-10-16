import { serverFn } from "@moonsjs/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db, todos } from "./db.server";

/** Dashboard CRUD contoh (Tahap 3): Drizzle + guard `ctx.demoUser`. */
const ownerOf = (ctx: { demoUser: string | null }): string => ctx.demoUser ?? "guest";

export const listTodos = serverFn({
  input: z.object({}),
  output: z.array(z.object({ id: z.number(), title: z.string(), done: z.boolean() })),
  handler: async ({ ctx }) =>
    db
      .select()
      .from(todos)
      .where(eq(todos.owner, ownerOf(ctx)))
      .all()
      .map((row) => ({ id: row.id, title: row.title, done: row.done })),
});

export const createTodo = serverFn({
  input: z.object({ title: z.string().min(1).max(80) }),
  output: z.object({ id: z.number() }),
  handler: async ({ input, ctx }) => {
    const row = db
      .insert(todos)
      .values({ owner: ownerOf(ctx), title: input.title, done: false })
      .returning()
      .get();
    return { id: row.id };
  },
});

export const toggleTodo = serverFn({
  input: z.object({ id: z.number().int().positive() }),
  output: z.object({ done: z.boolean() }).nullable(),
  handler: async ({ input, ctx }) => {
    const row = db
      .select()
      .from(todos)
      .where(and(eq(todos.id, input.id), eq(todos.owner, ownerOf(ctx))))
      .get();
    if (row === undefined) {
      return null;
    }
    const next = !row.done;
    db.update(todos).set({ done: next }).where(eq(todos.id, row.id)).run();
    return { done: next };
  },
});

export const deleteTodo = serverFn({
  input: z.object({ id: z.number().int().positive() }),
  output: z.object({ deleted: z.boolean() }),
  handler: async ({ input, ctx }) => {
    const deleted = db
      .delete(todos)
      .where(and(eq(todos.id, input.id), eq(todos.owner, ownerOf(ctx))))
      .returning({ id: todos.id })
      .all();
    return { deleted: deleted.length > 0 };
  },
});
