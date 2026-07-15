"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getJournalEntries() {
  return await prisma.journalEntry.findMany();
}

export async function createJournalEntry(formData: FormData) {
  const content = formData.get("content") as string;
  const mood = formData.get("mood") as string;
  
  if (!content) return;

  const today = new Date().toISOString().split('T')[0];

  await prisma.journalEntry.create({
    data: {
      content,
      mood: mood || "NEUTRAL",
      date: today,
    },
  });

  revalidatePath("/journal");
}

export async function deleteJournalEntry(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.journalEntry.delete({
    where: { id },
  });

  revalidatePath("/journal");
}
