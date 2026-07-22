"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { Mood } from "@prisma/client";
import { getCurrentUserId } from "@/lib/current-user";

export async function getJournalEntries() {
  const userId = await getCurrentUserId();
  return prisma.journalEntry.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });
}

export async function createJournalEntry(formData: FormData) {
  const content = formData.get("content") as string;
  const mood = formData.get("mood") as Mood;
  if (!content) return;

  const userId = await getCurrentUserId();

  await prisma.journalEntry.create({
    data: {
      content,
      mood: mood || "NEUTRAL",
      date: new Date(),
      userId,
    },
  });

  revalidatePath("/journal");
}

export async function deleteJournalEntry(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  const userId = await getCurrentUserId();
  await prisma.journalEntry.deleteMany({ where: { id, userId } });

  revalidatePath("/journal");
}
