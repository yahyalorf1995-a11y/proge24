"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getCurrentIdentity } from "@/lib/current-user";

async function getOrCreateConstitution(identityId: string) {
  const existing = await prisma.constitution.findUnique({ where: { identityId } });
  if (existing) return existing;
  return prisma.constitution.create({ data: { identityId } });
}

export async function getConstitution() {
  const identity = await getCurrentIdentity();
  const constitution = await getOrCreateConstitution(identity.id);

  const principles = await prisma.principle.findMany({
    where: { constitutionId: constitution.id },
    orderBy: { order: "asc" },
  });

  return { ...constitution, principles };
}

export async function updateConstitutionSummary(formData: FormData) {
  const identity = await getCurrentIdentity();
  const summary = formData.get("summary") as string;

  await prisma.constitution.upsert({
    where: { identityId: identity.id },
    create: { identityId: identity.id, summary },
    update: { summary },
  });

  revalidatePath("/constitution");
}

export async function addPrinciple(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  if (!title) return;

  const identity = await getCurrentIdentity();
  const constitution = await getOrCreateConstitution(identity.id);

  const order = await prisma.principle.count({
    where: { constitutionId: constitution.id },
  });

  await prisma.principle.create({
    data: { title, description, constitutionId: constitution.id, order },
  });

  revalidatePath("/constitution");
}

export async function removePrinciple(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.principle.delete({ where: { id } });
  revalidatePath("/constitution");
}
