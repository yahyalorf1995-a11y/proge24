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
  Check
} from "lucide-react";
import Link from "next/link";

export default async function Dashboard() {
  const stats = await getDashboardStats();
  const today = new Date();
  const dateString = today.toLocaleDateString('ar-SA', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-background text-xs font-normal px-2 py-0">
              <CalendarIcon className="w-3 h-3 me-1" /> {dateString}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">مركز القيادة</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            نظرة عامة على نظامك الشخصي. حافظ على التوافق ونفّذ.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/journal">
            <Button variant="outline" size="sm">
              <BookOpen className="w-4 h-4 me-2" /> تسجيل يومية
            </Button>
          </Link>
          <Link href="/tasks">
            <Button size="sm">
              <Plus className="w-4 h-4 me-2" /> مهمة جديدة
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
                <AlertCircle className="w-5 h-5 text-red-500" /> إجراء مطلوب
              </CardTitle>
              <CardDescription>أهم مهامك ذات الأولوية وتركيز اليوم.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {stats.tasks.topPriorities.length === 0 && stats.tasks.todaysFocus.length === 0 && (
                <div className="py-6 text-center text-sm text-muted-foreground bg-muted/20 rounded-md border border-dashed">
                  صندوق الوارد فارغ. خذ استراحة أو خطّط لما هو قادم.
                </div>
              )}

              {/* Priorities */}
              {stats.tasks.topPriorities.map((task: any) => (
                <div key={task.id} className="group flex items-start justify-between p-3 bg-red-500/5 border border-red-500/10 rounded-md hover:border-red-500/30 transition-colors">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{task.title}</span>
                      <Badge variant="destructive" className="text-[9px] px-1 py-0 h-4">{task.priority}</Badge>
                    </div>
                    {task.project && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <FolderKanban className="w-3 h-3" /> {task.project.title}
                      </span>
                    )}
                  </div>
                  <form action={updateTaskStatus}>
                    <input type="hidden" name="id" value={task.id} />
                    <input type="hidden" name="status" value="DONE" />
                    <Button size="sm" variant="outline" className="h-7 text-xs border-red-200 text-red-600 hover:bg-red-50">تم</Button>
                  </form>
                </div>
              ))}

              {/* Normal Focus */}
              {stats.tasks.todaysFocus.map((task: any) => (
                <div key={task.id} className="group flex items-start justify-between p-3 bg-background border rounded-md hover:border-primary/30 transition-colors">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm">{task.title}</span>
                    {task.project && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <FolderKanban className="w-3 h-3" /> {task.project.title}
                      </span>
                    )}
                  </div>
                  <form action={updateTaskStatus}>
                    <input type="hidden" name="id" value={task.id} />
                    <input type="hidden" name="status" value="DONE" />
                    <Button size="sm" variant="ghost" className="h-7 text-xs">تم</Button>
                  </form>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Active Projects */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FolderKanban className="w-5 h-5 text-blue-500" /> المشاريع النشطة
                </CardTitle>
                <CardDescription>تحريك العجلة إلى الأمام.</CardDescription>
              </div>
              <Link href="/projects" className="hidden sm:flex">
                <Button variant="ghost" size="sm" className="text-xs">عرض الكل</Button>
              </Link>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {stats.projects.active.length === 0 && (
                <div className="py-6 text-center text-sm text-muted-foreground border border-dashed rounded-md">
                  لا توجد مشاريع نشطة. ابدأ واحدًا لتكتسب الزخم.
                </div>
              )}
              {stats.projects.active.map((project: any) => (
                <div key={project.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 border rounded-md">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm">{project.title}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-normal px-1 py-0">{project.lifeArea?.title}</Badge>
                    </span>
                  </div>
                  <div className="w-full sm:w-1/3 space-y-1">
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>التقدّم</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all" style={{ width: `${project.progress}%` }} />
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
          <Card className="shadow-sm bg-muted/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" /> العادات اليومية
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {stats.habits.all.length === 0 && (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  لا توجد عادات مضافة.
                </div>
              )}
              {stats.habits.all.map((habit: any) => {
                const isDoneToday = habit.isDoneToday;
                return (
                  <div key={habit.id} className="flex items-center justify-between p-2.5 bg-background border rounded-md">
                    <div className="flex items-center gap-3">
                      <form action={toggleHabitCheckIn}>
                        <input type="hidden" name="id" value={habit.id} />
                        <input type="hidden" name="streak" value={habit.currentStreak} />
                        <input type="hidden" name="status" value={isDoneToday ? "done" : "undone"} />
                        <button type="submit" aria-label={isDoneToday ? "إلغاء إنجاز العادة" : "إتمام العادة"} className={`flex items-center justify-center w-6 h-6 rounded-full border transition-colors ${isDoneToday ? 'bg-green-500 border-green-500 text-white' : 'border-input hover:border-primary'}`}>
                          {isDoneToday && <Check className="w-4 h-4" />}
                        </button>
                      </form>
                      <span className={`text-sm ${isDoneToday ? 'text-muted-foreground line-through decoration-muted-foreground/50' : 'font-medium'}`}>
                        {habit.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-orange-500 font-medium">
                      <Flame className="w-3 h-3 fill-orange-500" /> {habit.currentStreak}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* AI Insights & Goal Progress */}
          <Card className="bg-gradient-to-br from-primary/5 via-background to-background border-primary/20 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-primary" /> ملاحظات النظام
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              {stats.aiInsights.map((insight: any, idx: number) => (
                <div key={idx} className="p-3 bg-background border rounded-md shadow-sm">
                  <p className={`font-medium flex items-center gap-1.5 ${
                    insight.type === 'warning' ? 'text-destructive' : 
                    insight.type === 'positive' ? 'text-green-600' : 'text-foreground'
                  }`}>
                    {insight.type === 'warning' && <AlertCircle className="w-4 h-4" />}
                    {insight.title}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">{insight.content}</p>
                </div>
              ))}

              {/* Mini Goals Preview */}
              <div className="mt-2 pt-4 border-t">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-muted-foreground" /> مسار الأهداف
                </h4>
                <div className="space-y-3">
                  {stats.goals.active.slice(0,2).map((goal: any) => (
                    <div key={goal.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium truncate pe-2">{goal.title}</span>
                        <span className="text-muted-foreground shrink-0">{goal.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all" style={{ width: `${goal.progress}%` }} />
                      </div>
                    </div>
                  ))}
                  {stats.goals.active.length > 2 && (
                    <Link href="/goals" className="text-xs text-primary hover:underline block text-center mt-2">
                      +{stats.goals.active.length - 2} أهداف أخرى
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Review & Activity */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="shadow-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                  <SearchCheck className="w-4 h-4 text-purple-500" /> آخر مراجعة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {stats.recent.latestReview ? (
                  <div className="flex flex-col gap-1">
                    <Badge variant="outline" className="w-fit text-[9px] mb-1">{stats.recent.latestReview.type}</Badge>
                    <span className="text-xs font-medium text-foreground">التقييم: {stats.recent.latestReview.rating}/10</span>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 mt-1">{stats.recent.latestReview.learnings}</p>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">لم تُجرَ أي مراجعة بعد.</p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                  <History className="w-4 h-4 text-muted-foreground" /> سجل النشاط
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                 {stats.recent.journals.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {stats.recent.journals.slice(0, 2).map((j: any) => (
                      <div key={j.id} className="text-xs">
                        <span className="font-medium">{j.mood}</span>
                        <p className="text-[10px] text-muted-foreground line-clamp-1 truncate">{j.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">لا توجد يوميات مسجّلة مؤخرًا.</p>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
