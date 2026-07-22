"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Fetch Projects
export async function getProjects() {
  return await prisma.project.findMany({
    include: { lifeArea: true, goal: true, tasks: true },
  });
}

// Create new Project
export async function createProject(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const lifeAreaId = formData.get("lifeAreaId") as string;
  const goalId = formData.get("goalId") as string;
  
  if (!title || !lifeAreaId) return;

  await prisma.project.create({
    data: {
      title,
      description,
      lifeAreaId,
      goalId: goalId === "none" ? null : goalId,
      status: "PLANNING",
      progress: 0,
    },
  });

  revalidatePath("/projects");
}

// Update Project Status
export async function updateProjectStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  
  if (!id || !status) return;

  await prisma.project.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/projects");
}

// Delete Project
export async function deleteProject(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.project.delete({
    where: { id },
  });

  revalidatePath("/projects");
}
