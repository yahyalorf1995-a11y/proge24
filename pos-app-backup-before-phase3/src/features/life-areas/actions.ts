"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Fetch Life Areas
export async function getLifeAreas() {
  const lifeAreas = await prisma.lifeArea.findMany({
    include: { goals: true, habits: true },
  });
  return lifeAreas;
}

// Create new Life Area
export async function createLifeArea(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  
  if (!title) return;

  // Assuming 'id-1' is the active identity from our mock
  await prisma.lifeArea.create({
    data: {
      title,
      description,
      identityId: "id-1", 
      icon: "Target", // default icon
    },
  });

  revalidatePath("/life-areas");
}

// Delete Life Area
export async function deleteLifeArea(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.lifeArea.delete({
    where: { id },
  });

  revalidatePath("/life-areas");
}
