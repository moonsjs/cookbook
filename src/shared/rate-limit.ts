/**
 * Rate limiter in-memory fixed-window — pola kanonik A3 tanpa dependensi.
 * Dipakai middleware global (moons.config.ts); production multi-instance
 * sebaiknya memakai store bersama (Redis) atau limiter di reverse proxy.
 */
export interface RateLimitOptions {
  /** Jumlah request yang diizinkan per window. */
  limit: number;
  /** Panjang window dalam milidetik. */
  windowMs: number;
  /** Injectable clock (test). */
  now?: () => number;
}

export interface RateLimitDecision {
  ok: boolean;
  retryAfterMs: number;
  remaining: number;
}

export function createRateLimiter(options: RateLimitOptions): (key: string) => RateLimitDecision {
  const hits = new Map<string, { count: number; resetAt: number }>();
  const now = options.now ?? (() => Date.now());

  return (key: string): RateLimitDecision => {
    const current = now();
    const entry = hits.get(key);

    if (entry === undefined || current >= entry.resetAt) {
      hits.set(key, { count: 1, resetAt: current + options.windowMs });
      return { ok: true, remaining: options.limit - 1, retryAfterMs: 0 };
    }

    if (entry.count >= options.limit) {
      return { ok: false, remaining: 0, retryAfterMs: entry.resetAt - current };
    }

    entry.count += 1;
    return { ok: true, remaining: options.limit - entry.count, retryAfterMs: 0 };
  };
}
