"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getCurrentIdentity } from "@/lib/current-user";

export async function getVision() {
  const identity = await getCurrentIdentity();
  return identity.vision ?? "";
}

export async function updateVision(formData: FormData) {
  const identity = await getCurrentIdentity();
  const vision = formData.get("vision") as string;

  await prisma.identity.update({
    where: { id: identity.id },
    data: { vision },
  });

  revalidatePath("/vision");
}
