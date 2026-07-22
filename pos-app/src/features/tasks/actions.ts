"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { TaskStatus, Priority } from "@prisma/client";
import { getCurrentUserId } from "@/lib/current-user";
import { ownsProject } from "@/lib/ownership";

// Fetch Tasks — scoped to the current user via the direct Task.userId link
// (projectId is optional, so ownership can't always be derived through
// Project -> LifeArea -> Identity; see prisma/schema.prisma).
export async function getTasks() {
  const userId = await getCurrentUserId();
  return prisma.task.findMany({
    where: { userId },
    include: { project: true },
    orderBy: { createdAt: "desc" },
  });
}

// Create new Task
export async function createTask(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const projectId = formData.get("projectId") as string;
  const priority = formData.get("priority") as Priority;

  if (!title) return;

  const userId = await getCurrentUserId();

  const resolvedProjectId = projectId === "none" || !projectId ? null : projectId;
  if (resolvedProjectId) {
    if (!(await ownsProject(resolvedProjectId, { userId }))) return;
  }

  await prisma.task.create({
    data: {
      title,
      description,
      userId,
      projectId: resolvedProjectId,
      priority: priority || "MEDIUM",
      status: "TODO",
    },
  });

  revalidatePath("/tasks");
  revalidatePath("/");
}

// Update Task Status (only if it belongs to the current user)
export async function updateTaskStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as TaskStatus;

  if (!id || !status) return;

  const userId = await getCurrentUserId();
  await prisma.task.updateMany({
    where: { id, userId },
    data: {
      status,
      isCompleted: status === "DONE",
      completedAt: status === "DONE" ? new Date() : null,
    },
  });

  revalidatePath("/tasks");
  revalidatePath("/");
}

// Delete Task (only if it belongs to the current user)
export async function deleteTask(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  const userId = await getCurrentUserId();
  await prisma.task.deleteMany({ where: { id, userId } });

  revalidatePath("/tasks");
  revalidatePath("/");
}
