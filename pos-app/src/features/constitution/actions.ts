"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getConstitution() {
  const constitution = await prisma.constitution.findUnique();
  const principles = await prisma.principle.findMany();
  return { ...constitution, principles };
}

export async function updateConstitutionSummary(formData: FormData) {
  const summary = formData.get("summary") as string;
  await prisma.constitution.upsert({
    create: { summary, identityId: "id-1" },
    update: { summary }
  });
  revalidatePath("/constitution");
}

export async function addPrinciple(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  
  if (!title) return;
  await prisma.principle.create({
    data: { title, description, constitutionId: "c-1" }
  });
  revalidatePath("/constitution");
}

export async function removePrinciple(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;
  await prisma.principle.delete({ where: { id } });
  revalidatePath("/constitution");
}
