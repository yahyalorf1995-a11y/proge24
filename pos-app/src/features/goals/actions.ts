"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Fetch Goals with their linked Life Areas
export async function getGoals() {
  return await prisma.goal.findMany({
    include: { lifeArea: true, projects: true },
  });
}

// Create new Goal
export async function createGoal(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const lifeAreaId = formData.get("lifeAreaId") as string;
  
  if (!title || !lifeAreaId) return;

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

// Update Goal Status
export async function updateGoalStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  
  if (!id || !status) return;

  await prisma.goal.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/goals");
}

// Delete Goal
export async function deleteGoal(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.goal.delete({
    where: { id },
  });

  revalidatePath("/goals");
}
