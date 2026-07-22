"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getCurrentIdentity } from "@/lib/current-user";

// Fetch Life Areas belonging to the current user's identity
export async function getLifeAreas() {
  const identity = await getCurrentIdentity();
  return prisma.lifeArea.findMany({
    where: { identityId: identity.id },
    include: { goals: true, habits: true },
    orderBy: { order: "asc" },
  });
}

// Create new Life Area
export async function createLifeArea(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  if (!title) return;

  const identity = await getCurrentIdentity();
  const order = await prisma.lifeArea.count({
    where: { identityId: identity.id },
  });

  await prisma.lifeArea.create({
    data: {
      title,
      description,
      identityId: identity.id,
      icon: "Target",
      order,
    },
  });

  revalidatePath("/life-areas");
}

// Delete Life Area (only if it belongs to the current user)
export async function deleteLifeArea(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  const identity = await getCurrentIdentity();
  await prisma.lifeArea.deleteMany({ where: { id, identityId: identity.id } });
  revalidatePath("/life-areas");
}
