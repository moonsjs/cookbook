import { Link, refresh, useLoaderData } from "@moonsjs/react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardTitle } from "../components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Input } from "../components/ui/input";
import { createTodo, deleteTodo, listTodos, toggleTodo } from "../server/todos.server";

/** Dashboard CRUD (Tahap 3) + komponen ala shadcn/ui (Radix: Dialog, Dropdown). */
export const loader = async () => ({ todos: await listTodos({ input: {} }) });

export default function DashboardPage() {
  const data = useLoaderData<typeof loader>();
  const [title, setTitle] = useState("");

  async function add(): Promise<void> {
    const trimmed = title.trim();
    if (trimmed.length === 0) {
      return;
    }
    await createTodo({ input: { title: trimmed } });
    setTitle("");
    refresh();
  }

  async function toggle(id: number): Promise<void> {
    await toggleTodo({ input: { id } });
    refresh();
  }

  async function remove(id: number): Promise<void> {
    await deleteTodo({ input: { id } });
    refresh();
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h1>Dashboard</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              aksi
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/blog">Blog (SSG)</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/login">Login</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardTitle>Todo</CardTitle>
        <p className="meta">
          serverFn + `refresh()`; owner = `ctx.demoUser ?? "guest"` (Drizzle).
        </p>
        <p className="my-3 flex gap-2">
          <Input
            value={title}
            onChange={(event) => setTitle(event.currentTarget.value)}
            placeholder="todo baru"
          />
          <Button data-action="create" onClick={add}>
            Tambah
          </Button>
        </p>
        <ul data-todos={data.todos.length}>
          {data.todos.map((todo) => (
            <li key={todo.id} data-done={String(todo.done)} className="flex items-center gap-2 py-1">
              <span>{todo.title}</span>
              <Button
                data-action="toggle"
                variant="outline"
                size="sm"
                onClick={() => toggle(todo.id)}
              >
                {todo.done ? "undo" : "done"}
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    hapus
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Hapus todo?</DialogTitle>
                  <DialogDescription>{todo.title}</DialogDescription>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Batal</Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        void remove(todo.id);
                      }}
                    >
                      Ya, hapus
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
