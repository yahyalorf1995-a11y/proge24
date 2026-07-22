"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { FrequencyType } from "@prisma/client";
import { getCurrentIdentity } from "@/lib/current-user";
import { ownsLifeArea, ownsGoal, forIdentityViaLifeArea } from "@/lib/ownership";

/** Normalizes "now" to a date-only value, matching the `@db.Date` column. */
function todayDateOnly(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

// Fetch Habits belonging to the current user, each annotated with whether
// it was checked in today (via HabitLog — see toggleHabitCheckIn below).
export async function getHabits() {
  const identity = await getCurrentIdentity();

  const habits = await prisma.habit.findMany({
    where: forIdentityViaLifeArea(identity.id),
    include: { lifeArea: true, goal: true },
    orderBy: { createdAt: "asc" },
  });

  if (habits.length === 0) return [];

  const today = todayDateOnly();
  const todaysLogs = await prisma.habitLog.findMany({
    where: {
      habitId: { in: habits.map((h) => h.id) },
      date: today,
    },
  });
  const doneMap = new Map(todaysLogs.map((log) => [log.habitId, log.isCompleted]));

  return habits.map((habit) => ({
    ...habit,
    isDoneToday: doneMap.get(habit.id) ?? false,
  }));
}

// Create new Habit
export async function createHabit(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const lifeAreaId = formData.get("lifeAreaId") as string;
  const goalId = formData.get("goalId") as string;
  const frequency = formData.get("frequency") as FrequencyType;

  if (!title || !lifeAreaId) return;

  const identity = await getCurrentIdentity();
  if (!(await ownsLifeArea(lifeAreaId, { identityId: identity.id }))) return;

  const resolvedGoalId = goalId === "none" || !goalId ? null : goalId;
  if (resolvedGoalId) {
    if (!(await ownsGoal(resolvedGoalId, { identityId: identity.id }))) return;
  }

  await prisma.habit.create({
    data: {
      title,
      description,
      lifeAreaId,
      goalId: resolvedGoalId,
      frequency: frequency || "DAILY",
    },
  });

  revalidatePath("/habits");
}

// Toggle Check-in (Mark habit as done/undone for today), scoped so a
// user can't check in on someone else's habit by guessing its id.
export async function toggleHabitCheckIn(formData: FormData) {
  const id = formData.get("id") as string;
  const currentStatus = formData.get("status") as string; // 'done' or 'undone'
  if (!id) return;

  const identity = await getCurrentIdentity();
  const habit = await prisma.habit.findFirst({
    where: { id, ...forIdentityViaLifeArea(identity.id) },
  });
  if (!habit) return;

  const today = todayDateOnly();
  const wasDone = currentStatus === "done";

  if (wasDone) {
    await prisma.habitLog.upsert({
      where: { habitId_date: { habitId: id, date: today } },
      create: { habitId: id, date: today, isCompleted: false },
      update: { isCompleted: false },
    });

    await prisma.habit.update({
      where: { id },
      data: { currentStreak: Math.max(0, habit.currentStreak - 1) },
    });
  } else {
    await prisma.habitLog.upsert({
      where: { habitId_date: { habitId: id, date: today } },
      create: { habitId: id, date: today, isCompleted: true },
      update: { isCompleted: true },
    });

    const newStreak = habit.currentStreak + 1;
    await prisma.habit.update({
      where: { id },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(habit.longestStreak, newStreak),
      },
    });
  }

  revalidatePath("/habits");
  revalidatePath("/");
}

// Delete Habit (only if it belongs to the current user)
export async function deleteHabit(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  const identity = await getCurrentIdentity();
  await prisma.habit.deleteMany({
    where: { id, ...forIdentityViaLifeArea(identity.id) },
  });

  revalidatePath("/habits");
}
