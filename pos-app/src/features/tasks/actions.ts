"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Fetch Tasks
export async function getTasks() {
  return await prisma.task.findMany({
    include: { project: true },
  });
}

// Create new Task
export async function createTask(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const projectId = formData.get("projectId") as string;
  const priority = formData.get("priority") as string;
  
  if (!title) return;

  await prisma.task.create({
    data: {
      title,
      description,
      projectId: projectId === "none" ? null : projectId,
      priority: priority || "MEDIUM",
      status: "TODO",
    },
  });

  revalidatePath("/tasks");
  // Also revalidate dashboard to update counts if needed
  revalidatePath("/");
}

// Update Task Status
export async function updateTaskStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  
  if (!id || !status) return;

  await prisma.task.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/tasks");
  revalidatePath("/");
}

// Delete Task
export async function deleteTask(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.task.delete({
    where: { id },
  });

  revalidatePath("/tasks");
  revalidatePath("/");
}
