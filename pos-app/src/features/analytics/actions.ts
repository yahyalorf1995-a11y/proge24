"use server";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, getCurrentUserId } from "@/lib/current-user";

export async function getAnalyticsData() {
  const identity = await getCurrentIdentity();
  const userId = await getCurrentUserId();

  const tasks = await prisma.task.findMany({ where: { userId } });
  const goals = await prisma.goal.findMany({ where: { lifeArea: { identityId: identity.id } } });
  const projects = await prisma.project.findMany({ where: { lifeArea: { identityId: identity.id } } });
  const habits = await prisma.habit.findMany({ where: { lifeArea: { identityId: identity.id } } });

  const completedTasks = tasks.filter((t) => t.isCompleted).length;
  const totalTasks = tasks.length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const achievedGoals = goals.filter((g) => g.status === "ACHIEVED").length;
  const totalGoals = goals.length;
  const goalCompletionRate = totalGoals > 0 ? Math.round((achievedGoals / totalGoals) * 100) : 0;

  const completedProjects = projects.filter((p) => p.status === "COMPLETED").length;
  const totalProjects = projects.length;

  const totalHabitStreaks = habits.reduce((acc, h) => acc + (h.currentStreak || 0), 0);

  return {
    tasks: { completed: completedTasks, total: totalTasks, rate: taskCompletionRate },
    goals: { completed: achievedGoals, total: totalGoals, rate: goalCompletionRate },
    projects: { completed: completedProjects, total: totalProjects },
    habits: { totalStreaks: totalHabitStreaks },
  };
}
