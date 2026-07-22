"use server";

import { prisma } from "@/lib/db";
import { gatherSystemContext } from "@/lib/ai-core";
import { getHabits } from "@/features/habits/actions";
import { getCurrentIdentity, getCurrentUserId } from "@/lib/current-user";

export async function getDashboardStats() {
  const identity = await getCurrentIdentity();
  const userId = await getCurrentUserId();

  // Fetch all core entities, scoped to the current user. These seven
  // queries are fully independent of one another (none depends on another's
  // result), so they run concurrently instead of one-at-a-time.
  const [lifeAreas, goals, projects, tasks, habits, journals, reviews] = await Promise.all([
    prisma.lifeArea.findMany({ where: { identityId: identity.id } }),
    prisma.goal.findMany({ where: { lifeArea: { identityId: identity.id } } }),
    prisma.project.findMany({
      where: { lifeArea: { identityId: identity.id } },
      include: { lifeArea: true },
    }),
    prisma.task.findMany({
      where: { userId },
      include: { project: true },
    }),
    getHabits(),
    prisma.journalEntry.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    }),
    prisma.review.findMany({
      where: { userId },
      orderBy: { periodEndDate: "desc" },
    }),
  ]);

  // Calculate specific stats
  const activeProjects = projects.filter((p) => p.status === "ACTIVE");
  const delayedProjects = projects.filter((p) => p.status === "ON_HOLD");

  const achievedGoals = goals.filter((g) => g.status === "ACHIEVED");
  const activeGoals = goals.filter((g) => g.status === "IN_PROGRESS");

  // Tasks Focus & Priorities
  const pendingTasks = tasks.filter((t) => t.status === "TODO" || t.status === "IN_PROGRESS");
  const topPriorities = pendingTasks.filter((t) => t.priority === "HIGH" || t.priority === "URGENT").slice(0, 5);
  const todaysFocus = pendingTasks.filter((t) => t.priority !== "HIGH" && t.priority !== "URGENT").slice(0, 5);

  // Recent Activity & Reviews
  const recentJournals = journals.slice(0, 3);
  const latestReview = reviews.length > 0 ? reviews[0] : null;

  const tasksCompletedCount = tasks.filter((t) => t.status === "DONE").length;
  const totalHabitStreak = habits.reduce((acc, h) => acc + (h.currentStreak || 0), 0);

  // AI Architecture Integration (Simulating LLM response based on context).
  // Reuses the data already fetched above instead of letting
  // gatherSystemContext() re-query lifeAreas/goals/projects/tasks/habits/
  // journals a second time.
  const context = await gatherSystemContext({
    identity,
    lifeAreas,
    goals,
    projects,
    tasks,
    habits,
    journals,
  });

  const aiInsights = [
    {
      title: "Alignment Check",
      content: context.activeProjects.length > 0
        ? `You have ${context.activeProjects.length} active project(s). Keep pushing.`
        : "You have NO active projects. Review your goals and start executing.",
      type: "neutral",
    },
    {
      title: "Execution Warning",
      content: context.tasksTodo.length > 5
        ? `You have a backlog of ${context.tasksTodo.length} pending tasks. Time to focus and clear them.`
        : `Your task list is manageable (${context.tasksTodo.length} pending). Great job staying on top of it.`,
      type: context.tasksTodo.length > 5 ? "warning" : "positive",
    },
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
      tasksCompleted: tasksCompletedCount,
      habitStreak: totalHabitStreak,
    },
    aiInsights,
  };
}
