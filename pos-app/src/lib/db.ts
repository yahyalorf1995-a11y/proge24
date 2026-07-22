import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Prisma 7 removed the built-in query engine binary; PrismaClient now
 * requires an explicit driver adapter to actually talk to the database
 * (bare `new PrismaClient()` throws PrismaClientConstructorValidationError).
 * See: https://pris.ly/d/client-constructor
 */
function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env and fill it in " +
        "(see the comments there for how to get a local or hosted Postgres URL)."
    );
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

/**
 * Standard Next.js Prisma singleton pattern.
 *
 * In development, Next.js hot-reloads modules, which would otherwise create
 * a new PrismaClient (and a new DB connection pool) on every file change.
 * Stashing the instance on `globalThis` avoids that.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * LAZY on purpose: `next build` imports every route module to collect page
 * data, even for routes that don't render statically. If PrismaClient (and
 * its DB connection pool) were constructed at module-load time, that build
 * step would fail whenever DATABASE_URL isn't available in the build
 * environment — even though no query ever actually runs at build time.
 * The Proxy defers real client creation until the first property access
 * (i.e. the first actual query, at request time).
 */
function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getPrismaClient(), prop, receiver);
  },
});
