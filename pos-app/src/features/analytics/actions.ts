"use server";

import { prisma } from "@/lib/db";

export async function getAnalyticsData() {
  const tasks = await prisma.task.findMany();
  const goals = await prisma.goal.findMany();
  const projects = await prisma.project.findMany();
  const habits = await prisma.habit.findMany();

  const completedTasks = tasks.filter((t: any) => t.isCompleted).length;
  const totalTasks = tasks.length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const achievedGoals = goals.filter((g: any) => g.status === "ACHIEVED").length;
  const totalGoals = goals.length;
  const goalCompletionRate = totalGoals > 0 ? Math.round((achievedGoals / totalGoals) * 100) : 0;

  const completedProjects = projects.filter((p: any) => p.status === "COMPLETED").length;
  const totalProjects = projects.length;
  
  const totalHabitStreaks = habits.reduce((acc: number, h: any) => acc + (h.currentStreak || 0), 0);

  return {
    tasks: { completed: completedTasks, total: totalTasks, rate: taskCompletionRate },
    goals: { completed: achievedGoals, total: totalGoals, rate: goalCompletionRate },
    projects: { completed: completedProjects, total: totalProjects },
    habits: { totalStreaks: totalHabitStreaks }
  };
}
