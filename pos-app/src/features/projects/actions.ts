"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { ProjectStatus } from "@prisma/client";
import { getCurrentIdentity } from "@/lib/current-user";
import { ownsLifeArea, ownsGoal, forIdentityViaLifeArea } from "@/lib/ownership";

// Fetch Projects — scoped to the current user
export async function getProjects() {
  const identity = await getCurrentIdentity();
  return prisma.project.findMany({
    where: forIdentityViaLifeArea(identity.id),
    include: { lifeArea: true, goal: true, tasks: true },
    orderBy: { createdAt: "desc" },
  });
}

// Create new Project
export async function createProject(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const lifeAreaId = formData.get("lifeAreaId") as string;
  const goalId = formData.get("goalId") as string;

  if (!title || !lifeAreaId) return;

  const identity = await getCurrentIdentity();
  if (!(await ownsLifeArea(lifeAreaId, { identityId: identity.id }))) return;

  const resolvedGoalId = goalId === "none" || !goalId ? null : goalId;
  if (resolvedGoalId) {
    if (!(await ownsGoal(resolvedGoalId, { identityId: identity.id }))) return;
  }

  await prisma.project.create({
    data: {
      title,
      description,
      lifeAreaId,
      goalId: resolvedGoalId,
      status: "PLANNING",
      progress: 0,
    },
  });

  revalidatePath("/projects");
}

// Update Project Status (only if it belongs to the current user)
export async function updateProjectStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as ProjectStatus;

  if (!id || !status) return;

  const identity = await getCurrentIdentity();
  await prisma.project.updateMany({
    where: { id, ...forIdentityViaLifeArea(identity.id) },
    data: { status },
  });

  revalidatePath("/projects");
}

// Delete Project (only if it belongs to the current user)
export async function deleteProject(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  const identity = await getCurrentIdentity();
  await prisma.project.deleteMany({
    where: { id, ...forIdentityViaLifeArea(identity.id) },
  });

  revalidatePath("/projects");
}
