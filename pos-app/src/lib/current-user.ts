import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session";
import type { Identity } from "@prisma/client";

/**
 * Returns the authenticated user's id. Redirects to /login if there is no
 * valid session. src/proxy.ts already redirects unauthenticated
 * requests before they reach a Server Component in most cases, but this is
 * the authoritative check — call it from any Server Action / Server
 * Component that must have a real user (i.e. virtually everything under
 * src/features).
 *
 * Stage 0 note: this replaces the old single-demo-user stub. Every caller
 * already used this exact function signature, so no other file changed.
 */
export async function getCurrentUserId(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const userId = await verifySessionToken(token);

  if (!userId) {
    redirect("/login");
  }
  return userId;
}

/**
 * Resolves (or lazily creates) the Identity row tied to the current user.
 * Modules that need an `identityId` (Constitution, LifeArea, ...) should
 * go through this instead of hardcoding one.
 */
export async function getCurrentIdentity(): Promise<Identity> {
  const userId = await getCurrentUserId();

  const existing = await prisma.identity.findUnique({ where: { userId } });
  if (existing) return existing;

  return prisma.identity.create({ data: { userId } });
}
