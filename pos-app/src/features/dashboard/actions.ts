"use server";

import { prisma } from "@/lib/db";
import { gatherSystemContext } from "@/lib/ai-core";

export async function getDashboardStats() {
  // Fetch all core entities
  const lifeAreas = await prisma.lifeArea.findMany();
  const goals = await prisma.goal.findMany();
  const projects = await prisma.project.findMany({
    include: { lifeArea: true }
  });
  const tasks = await prisma.task.findMany({
    include: { project: true }
  });
  const habits = await prisma.habit.findMany();
  const journals = await prisma.journalEntry.findMany();
  const reviews = await prisma.review.findMany();

  // Calculate specific stats
  const activeProjects = projects.filter((p: any) => p.status === "ACTIVE");
  const delayedProjects = projects.filter((p: any) => p.status === "ON_HOLD"); 
  
  const achievedGoals = goals.filter((g: any) => g.status === "ACHIEVED");
  const activeGoals = goals.filter((g: any) => g.status === "IN_PROGRESS");

  // Tasks Focus & Priorities
  const pendingTasks = tasks.filter((t: any) => t.status === "TODO" || t.status === "IN_PROGRESS");
  const topPriorities = pendingTasks.filter((t: any) => t.priority === "HIGH" || t.priority === "URGENT").slice(0, 5);
  const todaysFocus = pendingTasks.filter((t: any) => t.priority !== "HIGH" && t.priority !== "URGENT").slice(0, 5);
  
  // Recent Activity & Reviews
  const recentJournals = journals.slice(0, 3);
  const latestReview = reviews.length > 0 ? reviews[0] : null;

  const mockTaskCompleted = tasks.filter((t: any) => t.status === "DONE").length;
  const mockHabitStreak = habits.reduce((acc: number, h: any) => acc + (h.currentStreak || 0), 0);

  // AI Architecture Integration (Simulating LLM response based on context)
  const context = await gatherSystemContext();
  
  const aiInsights = [
    {
      title: "Alignment Check",
      content: context.activeProjects.length > 0 
        ? `You have ${context.activeProjects.length} active project(s). Keep pushing.` 
        : "You have NO active projects. Review your goals and start executing.",
      type: "neutral"
    },
    {
      title: "Execution Warning",
      content: context.tasksTodo.length > 5 
        ? `You have a backlog of ${context.tasksTodo.length} pending tasks. Time to focus and clear them.` 
        : `Your task list is manageable (${context.tasksTodo.length} pending). Great job staying on top of it.`,
      type: context.tasksTodo.length > 5 ? "warning" : "positive"
    }
  ];

  return {
    counts: {
      lifeAreas: lifeAreas.length,
      goals: goals.length,
      projects: projects.length,
    },
    projects: {
      active: activeProjects,
      activeCount: activeProjects.length,
      delayedCount: delayedProjects.length,
    },
    goals: {
      active: activeGoals,
      achievedCount: achievedGoals.length,
      activeCount: activeGoals.length,
    },
    tasks: {
      topPriorities,
      todaysFocus,
    },
    habits: {
      all: habits,
    },
    recent: {
      journals: recentJournals,
      latestReview,
    },
    execution: {
      tasksCompleted: mockTaskCompleted,
      habitStreak: mockHabitStreak,
    },
    aiInsights
  };
}
