/**
 * Shared ownership-verification helpers for Server Actions.
 *
 * Extracted from four near-identical copies previously living in
 * goals/actions.ts, habits/actions.ts, projects/actions.ts, and
 * tasks/actions.ts (see ARCHITECTURE_HARDENING_PHASE_3A.md for the audit
 * that flagged this).
 *
 * Every function here preserves the exact query shape each call site used
 * before this refactor — nothing here changes what is authorized or how.
 * The only thing that changed is that the query bodies are now written
 * once instead of four times.
 */

import { prisma } from "@/lib/db";

/**
 * The two ways call sites previously scoped an ownership check:
 *  - by Identity.id directly (goals/habits/projects, which already have
 *    the Identity object in hand via getCurrentIdentity())
 *  - by User.id via the Identity relation (tasks, which only resolves
 *    getCurrentUserId() and does not otherwise need the Identity row)
 *
 * Both filters describe the same real ownership relationship; keeping them
 * as distinct variants (rather than forcing every caller through
 * getCurrentIdentity()) avoids adding an extra DB round trip anywhere that
 * didn't already have one, i.e. behavior — including query count — is
 * unchanged from before this refactor.
 */
type OwnerFilter = { identityId: string } | { userId: string };

function lifeAreaOwnerWhere(filter: OwnerFilter) {
  return "identityId" in filter
    ? { identityId: filter.identityId }
    : { identity: { userId: filter.userId } };
}

/** True if the given LifeArea belongs to the given owner. */
export async function ownsLifeArea(lifeAreaId: string, filter: OwnerFilter): Promise<boolean> {
  const found = await prisma.lifeArea.findFirst({
    where: { id: lifeAreaId, ...lifeAreaOwnerWhere(filter) },
    select: { id: true },
  });
  return !!found;
}

/** True if the given Goal belongs (via its LifeArea) to the given owner. */
export async function ownsGoal(goalId: string, filter: OwnerFilter): Promise<boolean> {
  const found = await prisma.goal.findFirst({
    where: { id: goalId, lifeArea: lifeAreaOwnerWhere(filter) },
    select: { id: true },
  });
  return !!found;
}

/** True if the given Project belongs (via its LifeArea) to the given owner. */
export async function ownsProject(projectId: string, filter: OwnerFilter): Promise<boolean> {
  const found = await prisma.project.findFirst({
    where: { id: projectId, lifeArea: lifeAreaOwnerWhere(filter) },
    select: { id: true },
  });
  return !!found;
}

/**
 * Prisma `where` fragment scoping a LifeArea query to a given Identity.
 * Spread into a `where` object alongside other conditions, e.g.
 * `where: { id, ...forIdentity(identity.id) }`.
 */
export function forIdentity(identityId: string) {
  return { identityId };
}

/**
 * Prisma `where` fragment scoping a Goal/Project/Habit query to entities
 * under the given Identity via their LifeArea relation.
 */
export function forIdentityViaLifeArea(identityId: string) {
  return { lifeArea: { identityId } };
}
