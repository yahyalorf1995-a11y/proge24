import { headers } from "next/headers";

/**
 * Reusable, storage-agnostic rate limiter.
 *
 * The only thing that would need to change to move this from in-memory
 * (current, single-process) to a shared store like Redis for a distributed
 * deployment is providing a different `RateLimitStore` implementation —
 * `checkRateLimit()` and every caller (auth actions, or future callers)
 * stay exactly the same.
 */

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  /** Epoch ms when the current window resets. */
  resetAt: number;
};

export interface RateLimitStore {
  /**
   * Atomically increments the counter for `key` within its current window
   * and returns the updated count and when that window resets. If the
   * previous window for `key` has expired, starts a fresh one.
   */
  increment(key: string, windowMs: number): Promise<{ count: number; resetAt: number }>;
}

/**
 * In-memory fixed-window store. Correct and sufficient for a single Next.js
 * server process. NOT shared across multiple instances/regions — if this
 * app is ever deployed with more than one server process (horizontal
 * scaling, multi-region), replace `defaultStore` below with a
 * `RateLimitStore` backed by Redis (e.g. `INCR` + `EXPIRE`), which is a
 * drop-in swap since it implements the same one-method interface.
 */
class MemoryRateLimitStore implements RateLimitStore {
  private buckets = new Map<string, { count: number; resetAt: number }>();

  async increment(key: string, windowMs: number) {
    const now = Date.now();
    const existing = this.buckets.get(key);

    if (!existing || existing.resetAt <= now) {
      const bucket = { count: 1, resetAt: now + windowMs };
      this.buckets.set(key, bucket);
      this.pruneOccasionally(now);
      return bucket;
    }

    existing.count += 1;
    return existing;
  }

  /** Opportunistic cleanup (~1% of calls) so the Map doesn't grow unbounded on a long-running process. */
  private pruneOccasionally(now: number) {
    if (Math.random() > 0.01) return;
    for (const [key, bucket] of this.buckets) {
      if (bucket.resetAt <= now) this.buckets.delete(key);
    }
  }
}

const defaultStore: RateLimitStore = new MemoryRateLimitStore();

export type RateLimitOptions = {
  /** Max allowed attempts within the window (inclusive). */
  limit: number;
  /** Window duration in milliseconds. */
  windowMs: number;
  /** Which store to use; defaults to the process-local in-memory store. */
  store?: RateLimitStore;
};

/**
 * Records one attempt for `key` and reports whether it's still within the
 * allowed limit for its window. Call this once per attempt (e.g. once per
 * login/signup submission), before doing the real work.
 */
export async function checkRateLimit(key: string, options: RateLimitOptions): Promise<RateLimitResult> {
  const store = options.store ?? defaultStore;
  const { count, resetAt } = await store.increment(key, options.windowMs);

  return {
    allowed: count <= options.limit,
    remaining: Math.max(0, options.limit - count),
    resetAt,
  };
}

/**
 * Best-effort client identifier for building per-client rate-limit keys.
 * Reads standard proxy headers (set by Codespaces/most hosts); falls back
 * to a constant so rate limiting still degrades safely (shared bucket)
 * rather than throwing if no such header is present.
 */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = h.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}
