// Mock DB implementation for Sandbox environment
const mockIdentity = {
  id: "id-1",
  userId: "user-1",
  mission: "To build great software that empowers people.",
  vision: "A world where technology runs seamlessly in the background of everyday life.",
  createdAt: new Date(),
  updatedAt: new Date(),
  constitution: null,
};

const mockUser = {
  id: "user-1",
  email: "test@pos.com",
  name: "Test User",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockConstitution = {
  id: "c-1",
  identityId: "id-1",
  summary: "This constitution governs my daily decisions and aligns my actions with my core values.",
  createdAt: new Date(),
  updatedAt: new Date(),
};

let mockPrinciples = [
  {
    id: "pr-1",
    constitutionId: "c-1",
    title: "Continuous Learning",
    description: "Read at least one chapter of a non-fiction book daily.",
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "pr-2",
    constitutionId: "c-1",
    title: "Health First",
    description: "Never sacrifice sleep for work.",
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

let mockLifeAreas = [
  {
    id: "la-1",
    identityId: "id-1",
    title: "Health & Fitness",
    description: "Physical wellbeing, nutrition, and exercise.",
    icon: "Heart",
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "la-2",
    identityId: "id-1",
    title: "Career & Business",
    description: "Professional growth, skills, and networking.",
    icon: "Briefcase",
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

let mockGoals = [
  {
    id: "g-1",
    lifeAreaId: "la-1",
    title: "Run a Marathon",
    description: "Train and complete the upcoming city marathon.",
    status: "IN_PROGRESS",
    progress: 35,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "g-2",
    lifeAreaId: "la-2",
    title: "Promote to Senior",
    description: "Achieve the senior level by the end of the year.",
    status: "NOT_STARTED",
    progress: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

let mockProjects = [
  {
    id: "p-1",
    lifeAreaId: "la-1",
    goalId: "g-1",
    title: "16-Week Training Program",
    description: "Follow the strict 16-week running schedule.",
    status: "ACTIVE",
    progress: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "p-2",
    lifeAreaId: "la-2",
    goalId: null,
    title: "Update Portfolio & Resume",
    description: "Prepare for upcoming reviews.",
    status: "PLANNING",
    progress: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

let mockTasks = [
  {
    id: "t-1",
    projectId: "p-1",
    title: "Buy running shoes",
    description: "Visit the local sports store and get fitted for long-distance shoes.",
    status: "DONE",
    priority: "HIGH",
    isCompleted: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "t-2",
    projectId: "p-1",
    title: "Complete first 5k run",
    description: "Easy pace, zone 2 heart rate.",
    status: "TODO",
    priority: "MEDIUM",
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "t-3",
    projectId: "p-2",
    title: "Gather links for recent projects",
    description: "Collect URLs and descriptions for the portfolio update.",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

let mockHabits = [
  {
    id: "h-1",
    lifeAreaId: "la-1",
    goalId: "g-1",
    title: "Morning Stretch",
    description: "10 minutes of stretching before checking phone.",
    frequency: "DAILY",
    currentStreak: 12,
    lastCompletedDate: new Date().toISOString().split('T')[0], // Completed today
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "h-2",
    lifeAreaId: "la-2",
    goalId: null,
    title: "Read 10 Pages",
    description: "Industry-related books.",
    frequency: "DAILY",
    currentStreak: 4,
    lastCompletedDate: null, // Not completed today
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

let mockJournalEntries = [
  {
    id: "j-1",
    userId: "user-1",
    date: new Date().toISOString().split('T')[0],
    content: "Today was highly productive. I managed to finish the core modules of the project. I feel aligned with my goals.",
    mood: "AWESOME",
    tags: "productivity, focus",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

let mockReviews = [
  {
    id: "r-1",
    userId: "user-1",
    type: "WEEKLY",
    periodStartDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    periodEndDate: new Date().toISOString().split('T')[0],
    wins: "Completed the POS core execution modules. Maintained a 12-day habit streak.",
    improvements: "Need to allocate more focus time for deep work. Got distracted easily on Tuesday.",
    learnings: "Systems over goals. When the habit is tracked, I am 90% more likely to do it.",
    rating: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

export const prisma = {
  user: {
    findFirst: async () => mockUser,
    create: async () => mockUser,
  },
  identity: {
    findUnique: async () => mockIdentity,
    create: async () => mockIdentity,
    update: async ({ data }: any) => {
      if (data.mission !== undefined) mockIdentity.mission = data.mission;
      if (data.vision !== undefined) mockIdentity.vision = data.vision;
      return mockIdentity;
    },
  },
  constitution: {
    findUnique: async () => mockConstitution,
    upsert: async ({ create, update }: any) => {
      mockConstitution.summary = update.summary || create.summary;
      return mockConstitution;
    }
  },
  principle: {
    findMany: async () => mockPrinciples,
    create: async ({ data }: any) => {
      const newPrinciple = { ...data, id: `pr-${Date.now()}`, createdAt: new Date(), updatedAt: new Date(), order: mockPrinciples.length };
      mockPrinciples.push(newPrinciple);
      return newPrinciple;
    },
    delete: async ({ where }: any) => {
      mockPrinciples = mockPrinciples.filter(p => p.id !== where.id);
      return { success: true };
    }
  },
  lifeArea: {
    findMany: async ({ include }: any = {}) => {
      return mockLifeAreas.map(la => ({
        ...la,
        goals: include?.goals ? mockGoals.filter(g => g.lifeAreaId === la.id) : undefined,
        habits: include?.habits ? mockHabits.filter(h => h.lifeAreaId === la.id) : undefined,
      }));
    },
    create: async ({ data }: any) => {
      const newArea = {
        ...data,
        id: `la-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        order: mockLifeAreas.length,
      };
      mockLifeAreas.push(newArea);
      return newArea;
    },
    delete: async ({ where }: any) => {
      mockLifeAreas = mockLifeAreas.filter(la => la.id !== where.id);
      return { success: true };
    }
  },
  goal: {
    findMany: async ({ include }: any = {}) => {
      let result = [...mockGoals];
      if (include?.lifeArea || include?.projects) {
        result = result.map(g => ({
          ...g,
          lifeArea: include?.lifeArea ? (mockLifeAreas.find(la => la.id === g.lifeAreaId) || null) : undefined,
          projects: include?.projects ? mockProjects.filter(p => p.goalId === g.id) : undefined,
        }));
      }
      return result;
    },
    create: async ({ data }: any) => {
      const newGoal = {
        ...data,
        id: `g-${Date.now()}`,
        status: data.status || "NOT_STARTED",
        progress: data.progress || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockGoals.push(newGoal);
      return newGoal;
    },
    update: async ({ where, data }: any) => {
      const idx = mockGoals.findIndex(g => g.id === where.id);
      if (idx > -1) {
        mockGoals[idx] = { ...mockGoals[idx], ...data, updatedAt: new Date() };
        return mockGoals[idx];
      }
      return null;
    },
    delete: async ({ where }: any) => {
      mockGoals = mockGoals.filter(g => g.id !== where.id);
      return { success: true };
    }
  },
  project: {
    findMany: async ({ include }: any = {}) => {
      let result = [...mockProjects];
      if (include?.lifeArea || include?.goal || include?.tasks) {
        result = result.map(p => ({
          ...p,
          lifeArea: include?.lifeArea ? (mockLifeAreas.find(la => la.id === p.lifeAreaId) || null) : undefined,
          goal: include?.goal ? (mockGoals.find(g => g.id === p.goalId) || null) : undefined,
          tasks: include?.tasks ? mockTasks.filter(t => t.projectId === p.id) : undefined,
        }));
      }
      return result;
    },
    create: async ({ data }: any) => {
      const newProject = {
        ...data,
        id: `p-${Date.now()}`,
        status: data.status || "PLANNING",
        progress: data.progress || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockProjects.push(newProject);
      return newProject;
    },
    update: async ({ where, data }: any) => {
      const idx = mockProjects.findIndex(p => p.id === where.id);
      if (idx > -1) {
        mockProjects[idx] = { ...mockProjects[idx], ...data, updatedAt: new Date() };
        return mockProjects[idx];
      }
      return null;
    },
    delete: async ({ where }: any) => {
      mockProjects = mockProjects.filter(p => p.id !== where.id);
      return { success: true };
    }
  },
  task: {
    findMany: async ({ include }: any = {}) => {
      let result = [...mockTasks];
      if (include?.project) {
        result = result.map(t => ({
          ...t,
          project: t.projectId ? (mockProjects.find(p => p.id === t.projectId) || null) : null,
        }));
      }
      return result;
    },
    create: async ({ data }: any) => {
      const newTask = {
        ...data,
        id: `t-${Date.now()}`,
        status: data.status || "TODO",
        priority: data.priority || "MEDIUM",
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockTasks.push(newTask);
      return newTask;
    },
    update: async ({ where, data }: any) => {
      const idx = mockTasks.findIndex(t => t.id === where.id);
      if (idx > -1) {
        mockTasks[idx] = { 
          ...mockTasks[idx], 
          ...data, 
          isCompleted: data.status === "DONE" ? true : false,
          updatedAt: new Date() 
        };
        return mockTasks[idx];
      }
      return null;
    },
    delete: async ({ where }: any) => {
      mockTasks = mockTasks.filter(t => t.id !== where.id);
      return { success: true };
    }
  },
  habit: {
    findMany: async ({ include }: any = {}) => {
      let result = [...mockHabits];
      if (include?.lifeArea || include?.goal) {
        result = result.map(h => ({
          ...h,
          lifeArea: include?.lifeArea ? (mockLifeAreas.find(la => la.id === h.lifeAreaId) || null) : undefined,
          goal: include?.goal ? (mockGoals.find(g => g.id === h.goalId) || null) : undefined,
        }));
      }
      return result;
    },
    create: async ({ data }: any) => {
      const newHabit = {
        ...data,
        id: `h-${Date.now()}`,
        currentStreak: 0,
        lastCompletedDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockHabits.push(newHabit);
      return newHabit;
    },
    update: async ({ where, data }: any) => {
      const idx = mockHabits.findIndex(h => h.id === where.id);
      if (idx > -1) {
        mockHabits[idx] = { ...mockHabits[idx], ...data, updatedAt: new Date() };
        return mockHabits[idx];
      }
      return null;
    },
    delete: async ({ where }: any) => {
      mockHabits = mockHabits.filter(h => h.id !== where.id);
      return { success: true };
    }
  },
  journalEntry: {
    findMany: async () => {
      return [...mockJournalEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    create: async ({ data }: any) => {
      const newEntry = {
        ...data,
        id: `j-${Date.now()}`,
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockJournalEntries.push(newEntry);
      return newEntry;
    },
    delete: async ({ where }: any) => {
      mockJournalEntries = mockJournalEntries.filter(j => j.id !== where.id);
      return { success: true };
    }
  },
  review: {
    findMany: async () => {
      return [...mockReviews].sort((a, b) => new Date(b.periodEndDate).getTime() - new Date(a.periodEndDate).getTime());
    },
    create: async ({ data }: any) => {
      const newReview = {
        ...data,
        id: `r-${Date.now()}`,
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockReviews.push(newReview);
      return newReview;
    },
    delete: async ({ where }: any) => {
      mockReviews = mockReviews.filter(r => r.id !== where.id);
      return { success: true };
    }
  }
} as any;
