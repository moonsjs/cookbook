import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Database contoh (Tahap 3): Drizzle + driver `bun:sqlite` bawaan Bun —
 * tanpa dependensi native tambahan. In-memory agar cookbook deterministik;
 * app nyata memakai file/Postgres via driver Drizzle yang sama.
 */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  createdAt: text("created_at").notNull(),
});

export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  owner: text("owner").notNull(),
  title: text("title").notNull(),
  done: integer("done", { mode: "boolean" }).notNull().default(false),
});

const sqlite = new Database(":memory:");
sqlite.exec(`
  create table if not exists users (
    id integer primary key autoincrement,
    name text not null unique,
    created_at text not null
  );
  create table if not exists todos (
    id integer primary key autoincrement,
    owner text not null,
    title text not null,
    done integer not null default 0
  );
`);

export const db = drizzle(sqlite);
