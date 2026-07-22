import { prisma } from "@/lib/db";

// The context that gets injected into the LLM
export type SystemContext = {
  identity: any;
  lifeAreas: any[];
  activeGoals: any[];
  activeProjects: any[];
  tasksTodo: any[];
  recentJournalEntries: any[];
  habitStreaks: any[];
};

/**
 * Gathers the entire state of the user's Personal Operating System
 * to be used as context for the AI prompt.
 */
export async function gatherSystemContext(): Promise<SystemContext> {
  const identity = await prisma.identity.findUnique() || null;
  const lifeAreas = await prisma.lifeArea.findMany();
  
  const allGoals = await prisma.goal.findMany();
  const activeGoals = allGoals.filter((g: any) => g.status === "IN_PROGRESS");
  
  const allProjects = await prisma.project.findMany();
  const activeProjects = allProjects.filter((p: any) => p.status === "ACTIVE");

  const allTasks = await prisma.task.findMany();
  const tasksTodo = allTasks.filter((t: any) => t.status === "TODO");

  const allHabits = await prisma.habit.findMany();
  
  const allJournals = await prisma.journalEntry.findMany();
  const recentJournalEntries = allJournals.slice(0, 3); // last 3 days

  return {
    identity,
    lifeAreas,
    activeGoals,
    activeProjects,
    tasksTodo,
    recentJournalEntries,
    habitStreaks: allHabits,
  };
}

/**
 * This is the architecture stub for generating an AI Prompt.
 * When integrating a real LLM (like OpenAI or Claude), you pass this string.
 */
export function buildPromptFromContext(context: SystemContext): string {
  return `
    You are an elite AI Executive Coach. 
    Your client has the following Personal Operating System state:
    
    MISSION: ${context.identity?.mission || "Not defined"}
    VISION: ${context.identity?.vision || "Not defined"}
    
    ACTIVE GOALS: ${context.activeGoals.length}
    ACTIVE PROJECTS: ${context.activeProjects.length}
    PENDING TASKS: ${context.tasksTodo.length}
    
    RECENT JOURNAL (Mood: ${context.recentJournalEntries[0]?.mood || "N/A"}): 
    "${context.recentJournalEntries[0]?.content || "No recent entry"}"

    Task: Based on their mission and current execution state, provide 3 short, highly actionable insights or warnings to keep them aligned today.
  `;
}
