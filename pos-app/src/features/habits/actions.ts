"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Fetch Habits
export async function getHabits() {
  return await prisma.habit.findMany({
    include: { lifeArea: true, goal: true },
  });
}

// Create new Habit
export async function createHabit(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const lifeAreaId = formData.get("lifeAreaId") as string;
  const goalId = formData.get("goalId") as string;
  const frequency = formData.get("frequency") as string;
  
  if (!title || !lifeAreaId) return;

  await prisma.habit.create({
    data: {
      title,
      description,
      lifeAreaId,
      goalId: goalId === "none" ? null : goalId,
      frequency: frequency || "DAILY",
    },
  });

  revalidatePath("/habits");
}

// Toggle Check-in (Mark habit as done/undone for today)
export async function toggleHabitCheckIn(formData: FormData) {
  const id = formData.get("id") as string;
  const currentStatus = formData.get("status") as string; // 'done' or 'undone'
  const currentStreak = parseInt(formData.get("streak") as string, 10);
  
  if (!id) return;

  const today = new Date().toISOString().split('T')[0];

  if (currentStatus === "done") {
    // User is undoing the check-in
    await prisma.habit.update({
      where: { id },
      data: { 
        lastCompletedDate: null, // Simply reverting to null for this mock
        currentStreak: Math.max(0, currentStreak - 1)
      },
    });
  } else {
    // User is checking in for today
    await prisma.habit.update({
      where: { id },
      data: { 
        lastCompletedDate: today,
        currentStreak: currentStreak + 1
      },
    });
  }

  revalidatePath("/habits");
  revalidatePath("/");
}

// Delete Habit
export async function deleteHabit(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.habit.delete({
    where: { id },
  });

  revalidatePath("/habits");
}
