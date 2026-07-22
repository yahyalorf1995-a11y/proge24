"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Helper function to get or create a dummy user for development
async function getTestUser() {
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: "test@pos.com",
        name: "Test User",
      },
    });
  }
  return user;
}

// Fetch Identity
export async function getIdentity() {
  const user = await getTestUser();
  
  let identity = await prisma.identity.findUnique({
    where: { userId: user.id },
    include: { constitution: true },
  });

  // Create an empty identity if none exists
  if (!identity) {
    identity = await prisma.identity.create({
      data: {
        userId: user.id,
      },
      include: { constitution: true },
    });
  }

  return identity;
}

// Update Identity (Mission)
export async function updateIdentity(formData: FormData) {
  const user = await getTestUser();
  const mission = formData.get("mission") as string;

  if (mission === null) return;

  await prisma.identity.update({
    where: { userId: user.id },
    data: {
      mission,
    },
  });

  revalidatePath("/identity");
}
