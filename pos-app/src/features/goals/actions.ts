"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { GoalStatus } from "@prisma/client";
import { getCurrentIdentity } from "@/lib/current-user";
import { ownsLifeArea, forIdentityViaLifeArea } from "@/lib/ownership";

// Fetch Goals with their linked Life Areas — scoped to the current user
export async function getGoals() {
  const identity = await getCurrentIdentity();
  return prisma.goal.findMany({
    where: forIdentityViaLifeArea(identity.id),
    include: { lifeArea: true, projects: true },
    orderBy: { createdAt: "desc" },
  });
}

// Create new Goal
export async function createGoal(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const lifeAreaId = formData.get("lifeAreaId") as string;

  if (!title || !lifeAreaId) return;

  const identity = await getCurrentIdentity();
  // Verify the target life area actually belongs to the current user
  // before attaching a goal to it.
  if (!(await ownsLifeArea(lifeAreaId, { identityId: identity.id }))) return;

  await prisma.goal.create({
    data: {
      title,
      description,
      lifeAreaId,
      status: "NOT_STARTED",
      progress: 0,
    },
  });

  revalidatePath("/goals");
}

// Update Goal Status (only if it belongs to the current user)
export async function updateGoalStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as GoalStatus;

  if (!id || !status) return;

  const identity = await getCurrentIdentity();
  await prisma.goal.updateMany({
    where: { id, ...forIdentityViaLifeArea(identity.id) },
    data: { status },
  });

  revalidatePath("/goals");
}

// Delete Goal (only if it belongs to the current user)
export async function deleteGoal(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  const identity = await getCurrentIdentity();
  await prisma.goal.deleteMany({
    where: { id, ...forIdentityViaLifeArea(identity.id) },
  });

  revalidatePath("/goals");
}
