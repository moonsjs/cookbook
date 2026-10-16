import { serverFn } from "@moonsjs/server";
import { z } from "zod";

/**
 * Menjaga jalur app-level `Ctx` (typegen §13, temuan dogfood decisions/0011)
 * tetap teruji: `ctx` bertipe dari `moons.config.ts` dan dipakai di handler.
 * Pola auth minimum (A3): sesi/cookie diparse di `context(req)` → `ctx.demoUser`.
 */
export const whoami = serverFn({
  input: z.object({}),
  output: z.object({ requestId: z.string(), user: z.string().nullable() }),
  handler: async ({ ctx }) => ({ requestId: ctx.requestId, user: ctx.demoUser }),
});
