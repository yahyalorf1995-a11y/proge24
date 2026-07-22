import { prisma } from "@/lib/db";
import { getCurrentIdentity, getCurrentUserId } from "@/lib/current-user";

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
 * Pre-fetched source data gatherSystemContext needs. Callers that already
 * queried this data (e.g. the dashboard) can pass it in directly so
 * gatherSystemContext doesn't query it again; callers that don't have it
 * yet can omit this argument and it will be fetched here, exactly as
 * gatherSystemContext always did on its own.
 */
export type SystemContextSourceData = {
  identity: any;
  lifeAreas: any[];
  goals: any[];
  projects: any[];
  tasks: any[];
  habits: any[];
  journals: any[];
};

/**
 * Standalone fetch path, used only when gatherSystemContext() is called
 * without pre-fetched data. Behavior is identical to the original
 * implementation (same six queries, same filters), except the queries now
 * run concurrently instead of one-at-a-time.
 */
async function fetchSourceData(): Promise<SystemContextSourceData> {
  const identity = await getCurrentIdentity();
  const userId = await getCurrentUserId();

  const [lifeAreas, goals, projects, tasks, habits, journals] = await Promise.all([
    prisma.lifeArea.findMany({ where: { identityId: identity.id } }),
    prisma.goal.findMany({ where: { lifeArea: { identityId: identity.id } } }),
    prisma.project.findMany({ where: { lifeArea: { identityId: identity.id } } }),
    prisma.task.findMany({ where: { userId } }),
    prisma.habit.findMany({ where: { lifeArea: { identityId: identity.id } } }),
    prisma.journalEntry.findMany({ where: { userId }, orderBy: { date: "desc" } }),
  ]);

  return { identity, lifeAreas, goals, projects, tasks, habits, journals };
}

/**
 * Gathers the entire state of the user's Personal Operating System
 * to be used as context for the AI prompt.
 *
 * Pass `preFetched` (e.g. from the dashboard, which already queried the
 * same tables) to avoid re-querying the database for data the caller
 * already has in hand.
 */
export async function gatherSystemContext(preFetched?: SystemContextSourceData): Promise<SystemContext> {
  const data = preFetched ?? (await fetchSourceData());

  const activeGoals = data.goals.filter((g: any) => g.status === "IN_PROGRESS");
  const activeProjects = data.projects.filter((p: any) => p.status === "ACTIVE");
  const tasksTodo = data.tasks.filter((t: any) => t.status === "TODO");
  const recentJournalEntries = data.journals.slice(0, 3); // last 3 entries

  return {
    identity: data.identity,
    lifeAreas: data.lifeAreas,
    activeGoals,
    activeProjects,
    tasksTodo,
    recentJournalEntries,
    habitStreaks: data.habits,
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
