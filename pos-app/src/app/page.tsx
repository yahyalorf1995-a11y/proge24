import { getDashboardStats } from "@/features/dashboard/actions";
import { updateTaskStatus } from "@/features/tasks/actions";
import { toggleHabitCheckIn } from "@/features/habits/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FolderKanban, 
  Target, 
  Calendar as CalendarIcon,
  Flame,
  AlertCircle,
  Plus,
  BookOpen,
  History,
  BrainCircuit,
  SearchCheck,
  Check,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

export default async function Dashboard() {
  const stats = await getDashboardStats();
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const todayISO = today.toISOString().split('T')[0];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-background text-xs font-normal px-2 py-0">
              <CalendarIcon className="w-3 h-3 mr-1" /> {dateString}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Command Center</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Your personal operating system overview. Stay aligned and execute.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/journal">
            <Button variant="outline" size="sm">
              <BookOpen className="w-4 h-4 mr-2" /> Log Journal
            </Button>
          </Link>
          <Link href="/tasks">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" /> New Task
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Execution (Tasks & Habits) */}
        <div className="md:col-span-12 lg:col-span-7 flex flex-col gap-6">
          
          {/* Top Priorities & Today's Focus */}
          <Card className="border-primary/10 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="h-1 w-full bg-gradient-to-r from-red-500 via-orange-400 to-primary"></div>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" /> Action Required
              </CardTitle>
              <CardDescription className="text-xs">Your highest priority tasks and today&apos;s focus.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {stats.tasks.topPriorities.length === 0 && stats.tasks.todaysFocus.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground bg-muted/30 rounded-xl border border-dashed border-border/60">
                  <CheckCircle2 className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  Inbox zero. Take a break or plan ahead.
                </div>
              )}

              {/* Priorities */}
              {stats.tasks.topPriorities.map((task: any) => (
                <div key={task.id} className="group flex items-start justify-between p-3.5 bg-red-500/5 border border-red-500/10 rounded-xl hover:-translate-y-[1px] hover:shadow-sm hover:border-red-500/30 transition-all duration-300">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground/90">{task.title}</span>
                      <Badge variant="destructive" className="text-[9px] px-1.5 py-0 h-4 rounded-full">{task.priority}</Badge>
                    </div>
                    {task.project && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-medium">
                        <FolderKanban className="w-3.5 h-3.5 text-muted-foreground/70" /> {task.project.title}
                      </span>
                    )}
                  </div>
                  <form action={updateTaskStatus}>
                    <input type="hidden" name="id" value={task.id} />
                    <input type="hidden" name="status" value="DONE" />
                    <Button size="sm" variant="outline" className="h-7 text-xs border-red-200 text-red-600 hover:bg-red-50 rounded-full px-3 transition-colors">Done</Button>
                  </form>
                </div>
              ))}

              {/* Normal Focus */}
              {stats.tasks.todaysFocus.map((task: any) => (
                <div key={task.id} className="group flex items-start justify-between p-3.5 bg-card border border-border/50 rounded-xl hover:-translate-y-[1px] hover:shadow-sm hover:border-primary/20 transition-all duration-300">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-medium text-sm text-foreground/80">{task.title}</span>
                    {task.project && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-medium">
                        <FolderKanban className="w-3.5 h-3.5 text-muted-foreground/70" /> {task.project.title}
                      </span>
                    )}
                  </div>
                  <form action={updateTaskStatus}>
                    <input type="hidden" name="id" value={task.id} />
                    <input type="hidden" name="status" value="DONE" />
                    <Button size="sm" variant="ghost" className="h-7 text-xs rounded-full px-3 text-muted-foreground hover:text-foreground">Done</Button>
                  </form>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Active Projects */}
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FolderKanban className="w-5 h-5 text-blue-500" /> Active Projects
                </CardTitle>
                <CardDescription className="text-xs">Moving the needle forward.</CardDescription>
              </div>
              <Link href="/projects" className="hidden sm:flex">
                <Button variant="ghost" size="sm" className="text-xs">View All</Button>
              </Link>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {stats.projects.active.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground border border-dashed border-border/60 rounded-xl bg-muted/10">
                  <FolderKanban className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  No active projects. Start one to gain momentum.
                </div>
              )}
              {stats.projects.active.map((project: any) => (
                <div key={project.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-border/50 rounded-xl bg-card hover:border-primary/20 hover:shadow-sm hover:-translate-y-[1px] transition-all duration-300">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-semibold text-sm text-foreground/90">{project.title}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">{project.lifeArea?.title}</Badge>
                    </span>
                  </div>
                  <div className="w-full sm:w-1/3 space-y-1.5">
                    <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                      <span>Progress</span>
                      <span className="text-foreground/70">{project.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500 ease-out" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

        {/* RIGHT COLUMN: Tracking, Habits & Insights */}
        <div className="md:col-span-12 lg:col-span-5 flex flex-col gap-6">
          
          {/* Habits Tracker */}
          <Card className="shadow-sm border-border/50 bg-card/40">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" /> Daily Habits
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5">
              {stats.habits.all.length === 0 && (
                <div className="py-6 text-center text-sm text-muted-foreground border border-dashed border-border/60 rounded-xl">
                  No habits set. Build your systems.
                </div>
              )}
              {stats.habits.all.map((habit: any) => {
                const isDoneToday = habit.lastCompletedDate === todayISO;
                return (
                  <div key={habit.id} className={`group flex items-center justify-between p-3 border rounded-xl transition-all duration-300 ${isDoneToday ? 'bg-green-500/5 border-green-500/20' : 'bg-card border-border/50 hover:border-primary/20 hover:-translate-y-[1px] shadow-sm'}`}>
                    <div className="flex items-center gap-3">
                      <form action={toggleHabitCheckIn}>
                        <input type="hidden" name="id" value={habit.id} />
                        <input type="hidden" name="streak" value={habit.currentStreak} />
                        <input type="hidden" name="status" value={isDoneToday ? "done" : "undone"} />
                        <button type="submit" aria-label={isDoneToday ? "Undo habit" : "Complete habit"} className={`flex items-center justify-center w-6 h-6 rounded-full border transition-all duration-300 ${isDoneToday ? 'bg-green-500 border-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'border-border/80 text-transparent hover:border-primary/50'}`}>
                          <Check className={`w-3.5 h-3.5 ${isDoneToday ? 'opacity-100 scale-100' : 'opacity-0 scale-50 transition-all duration-200 group-hover:opacity-20 group-hover:scale-100'}`} />
                        </button>
                      </form>
                      <span className={`text-sm transition-all duration-300 ${isDoneToday ? 'text-muted-foreground/60 line-through decoration-muted-foreground/30' : 'font-medium text-foreground/90'}`}>
                        {habit.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-orange-500 font-semibold bg-orange-500/10 px-2 py-0.5 rounded-full">
                      <Flame className="w-3.5 h-3.5 fill-orange-500" /> {habit.currentStreak}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* AI Insights & Goal Progress */}
          <Card className="bg-gradient-to-br from-primary/[0.03] via-background to-background border-primary/10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-primary" /> OS Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3.5 text-sm relative z-10">
              {stats.aiInsights.map((insight: any, idx: number) => (
                <div key={idx} className="p-3.5 bg-card/80 backdrop-blur-sm border border-border/40 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <p className={`font-semibold flex items-center gap-1.5 ${
                    insight.type === 'warning' ? 'text-red-500' : 
                    insight.type === 'positive' ? 'text-green-600' : 'text-foreground/90'
                  }`}>
                    {insight.type === 'warning' && <AlertCircle className="w-4 h-4" />}
                    {insight.title}
                  </p>
                  <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">{insight.content}</p>
                </div>
              ))}

              {/* Mini Goals Preview */}
              <div className="mt-3 pt-5 border-t border-border/50">
                <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Target className="w-3.5 h-3.5" /> Trajectory
                </h4>
                <div className="space-y-4">
                  {stats.goals.active.slice(0,2).map((goal: any) => (
                    <div key={goal.id} className="space-y-1.5 group cursor-default">
                      <div className="flex justify-between text-xs items-center">
                        <span className="font-medium text-foreground/80 truncate pr-2 group-hover:text-foreground transition-colors">{goal.title}</span>
                        <span className="text-muted-foreground shrink-0 font-medium">{goal.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary/80 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-700 ease-out" style={{ width: `${goal.progress}%` }} />
                      </div>
                    </div>
                  ))}
                  {stats.goals.active.length > 2 && (
                    <Link href="/goals" className="text-[11px] font-medium text-primary/80 hover:text-primary transition-colors block text-center mt-3 bg-primary/5 py-1.5 rounded-full">
                      View {stats.goals.active.length - 2} more active goals
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Review & Activity */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="shadow-sm border-border/50 bg-card hover:border-border transition-colors">
              <CardHeader className="p-4 pb-3">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <SearchCheck className="w-3.5 h-3.5" /> Latest Review
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {stats.recent.latestReview ? (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary" className="bg-muted/50 text-[9px] px-1.5 rounded-sm">{stats.recent.latestReview.type}</Badge>
                      <span className="text-[10px] font-bold text-foreground bg-secondary/50 px-1.5 py-0.5 rounded-sm">{stats.recent.latestReview.rating}/10</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-3 mt-1 leading-relaxed">{stats.recent.latestReview.learnings}</p>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No review done yet.</p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border/50 bg-card hover:border-border transition-colors">
              <CardHeader className="p-4 pb-3">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" /> Activity Log
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                 {stats.recent.journals.length > 0 ? (
                  <div className="flex flex-col gap-2.5">
                    {stats.recent.journals.slice(0, 2).map((j: any) => (
                      <div key={j.id} className="text-xs border-l-2 border-primary/20 pl-2">
                        <span className="font-semibold text-[10px] text-foreground/80 mb-0.5 block">{j.mood}</span>
                        <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">{j.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No recent entries.</p>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}