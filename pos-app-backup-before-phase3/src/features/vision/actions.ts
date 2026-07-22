"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getVision() {
  const identity = await prisma.identity.findUnique();
  return identity?.vision || "";
}

export async function updateVision(formData: FormData) {
  const vision = formData.get("vision") as string;
  await prisma.identity.update({ data: { vision } });
  revalidatePath("/vision");
}
