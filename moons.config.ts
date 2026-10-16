import { defineConfig } from "@moonsjs/core";
import { createRateLimiter } from "./src/shared/rate-limit";

const rpcLimiter = createRateLimiter({ limit: 30, windowMs: 1_000 });

/**
 * Cookie mentah (tanpa helper framework): cukup `Request.headers`.
 * Sesi asli memakai atribut HttpOnly/Secure/SameSite di sisi yang men-set
 * cookie — lihat panduan "Auth & CSRF".
 */
function readDemoUser(req: Request): string | null {
  const cookie = req.headers.get("cookie");
  if (cookie === null) {
    return null;
  }
  for (const part of cookie.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === "demo_user" && rest.length > 0) {
      return decodeURIComponent(rest.join("="));
    }
  }
  return null;
}

export default defineConfig({
  routesDir: "src/routes",
  context: async (req) => ({
    requestId: crypto.randomUUID(),
    url: req.url,
    demoUser: readDemoUser(req),
  }),
  // Rate limit sebagai middleware global (A3) — bukan fitur core; lihat
  // docs/site/panduan/rate-limit.md.
  middleware: [
    async ({ req, next }) => {
      const url = new URL(req.url);
      if (url.pathname.startsWith("/_moons/fn/")) {
        const key = req.headers.get("x-forwarded-for") ?? "local";
        const decision = rpcLimiter(key);
        if (!decision.ok) {
          return new Response("rate limit terlampaui", {
            status: 429,
            headers: { "retry-after": String(Math.max(1, Math.ceil(decision.retryAfterMs / 1000))) },
          });
        }
      }
      return next();
    },
  ],
});
