"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getCurrentIdentity } from "@/lib/current-user";

// Fetch Identity (creating an empty one on first visit)
export async function getIdentity() {
  const identity = await getCurrentIdentity();

  return prisma.identity.findUnique({
    where: { id: identity.id },
    include: { constitution: true },
  });
}

// Update Identity (Mission & Vision)
export async function updateIdentity(formData: FormData) {
  const identity = await getCurrentIdentity();
  const mission = formData.get("mission") as string;
  const vision = formData.get("vision") as string;

  await prisma.identity.update({
    where: { id: identity.id },
    data: { mission, vision },
  });

  revalidatePath("/identity");
}
