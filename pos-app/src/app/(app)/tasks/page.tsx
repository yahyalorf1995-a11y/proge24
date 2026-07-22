import { getTasks, createTask, deleteTask, updateTaskStatus } from "@/features/tasks/actions";
import { getProjects } from "@/features/projects/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Circle, CheckCircle2, Clock } from "lucide-react";
import { JourneyFooter } from "@/components/layout/JourneyFooter";

const PRIORITY_LABELS: Record<string, string> = {
  LOW: "منخفضة",
  MEDIUM: "متوسطة",
  HIGH: "عالية",
  URGENT: "عاجلة",
};

export default async function TasksPage() {
  const tasks = await getTasks();
  const projects = await getProjects();

  // Group tasks by status
  const todoTasks = tasks.filter((t: any) => t.status === "TODO");
  const inProgressTasks = tasks.filter((t: any) => t.status === "IN_PROGRESS");
  const doneTasks = tasks.filter((t: any) => t.status === "DONE");

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">المهام</h1>
        <p className="text-muted-foreground mt-2">
          قائمة تنفيذك اليومية. اربط المهام بالمشاريع لتضمن أن عملك يُحرّك المؤشر فعليًا.
        </p>
      </div>

      {/* Add New Task Form */}
      <Card className="bg-background border-primary/20 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">إضافة مهمة سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createTask} className="flex gap-4 items-start flex-col md:flex-row">
            <div className="flex-1 w-full flex flex-col gap-3">
              <div className="flex gap-4">
                <input
                  name="title"
                  required
                  placeholder="ما الذي يجب إنجازه؟"
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                <select
                  name="priority"
                  className="flex h-10 w-[140px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  defaultValue="MEDIUM"
                >
                  <option value="LOW">أولوية منخفضة</option>
                  <option value="MEDIUM">أولوية متوسطة</option>
                  <option value="HIGH">أولوية عالية</option>
                  <option value="URGENT">عاجلة</option>
                </select>
              </div>
              <div className="flex gap-4">
                <input
                  name="description"
                  placeholder="تفاصيل (اختياري)"
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                <select
                  name="projectId"
                  className="flex h-10 w-[240px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  defaultValue="none"
                >
                  <option value="none">صندوق الوارد (بدون مشروع)</option>
                  {projects.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <Button type="submit" className="h-[84px] md:w-[120px] w-full">إضافة مهمة</Button>
          </form>
        </CardContent>
      </Card>

      {/* Tasks List - Grouped by Status */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* TODO Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Circle className="w-4 h-4 text-muted-foreground" /> قيد الانتظار
            </h3>
            <Badge variant="secondary">{todoTasks.length}</Badge>
          </div>
          <div className="flex flex-col gap-3">
            {todoTasks.map((task: any) => <TaskCard key={task.id} task={task} />)}
            {todoTasks.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">لا توجد مهام قيد الانتظار.</p>}
          </div>
        </div>

        {/* IN PROGRESS Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" /> قيد التنفيذ
            </h3>
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">{inProgressTasks.length}</Badge>
          </div>
          <div className="flex flex-col gap-3">
            {inProgressTasks.map((task: any) => <TaskCard key={task.id} task={task} />)}
            {inProgressTasks.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">لا يوجد شيء قيد التنفيذ حاليًا.</p>}
          </div>
        </div>

        {/* DONE Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> مكتملة
            </h3>
            <Badge variant="secondary" className="bg-green-500/10 text-green-600">{doneTasks.length}</Badge>
          </div>
          <div className="flex flex-col gap-3">
            {doneTasks.map((task: any) => <TaskCard key={task.id} task={task} />)}
            {doneTasks.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">لم تُكتمل أي مهمة بعد.</p>}
          </div>
        </div>

      </div>

      <JourneyFooter 
        prevLink="/projects" prevLabel="العودة للمشاريع"
        nextLink="/habits" nextLabel="الخطوة التالية: بناء العادات" 
      />
    </div>
  );
}

// Sub-component for rendering a single task card
function TaskCard({ task }: { task: any }) {
  const isDone = task.status === "DONE";
  
  return (
    <Card className={`relative group ${isDone ? "opacity-60 bg-muted/50" : "hover:border-primary/50"} transition-colors`}>
      <CardContent className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-col gap-1">
            <span className={`text-sm font-medium leading-tight ${isDone ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </span>
            {task.description && (
              <span className="text-xs text-muted-foreground line-clamp-2">
                {task.description}
              </span>
            )}
          </div>

          <form action={deleteTask}>
            <input type="hidden" name="id" value={task.id} />
            <Button variant="ghost" size="icon" aria-label="حذف المهمة" className="h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <Trash2 size={14} />
            </Button>
          </form>
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
          <div className="flex gap-2">
             {task.project && (
               <Badge variant="outline" className="text-[9px] px-1 py-0 font-normal">
                 {task.project.title.substring(0, 15)}...
               </Badge>
             )}
             {task.priority === "HIGH" || task.priority === "URGENT" ? (
               <Badge variant="destructive" className="text-[9px] px-1 py-0">{PRIORITY_LABELS[task.priority] ?? task.priority}</Badge>
             ) : null}
          </div>

          <div className="flex items-center gap-1">
            {task.status === "TODO" && (
              <form action={updateTaskStatus}>
                <input type="hidden" name="id" value={task.id} />
                <input type="hidden" name="status" value="IN_PROGRESS" />
                <Button size="sm" variant="outline" className="h-6 text-[10px] px-2">ابدأ</Button>
              </form>
            )}
            {task.status === "IN_PROGRESS" && (
              <form action={updateTaskStatus}>
                <input type="hidden" name="id" value={task.id} />
                <input type="hidden" name="status" value="DONE" />
                <Button size="sm" className="h-6 text-[10px] px-2 bg-green-600 hover:bg-green-700">تم</Button>
              </form>
            )}
            {task.status === "DONE" && (
               <form action={updateTaskStatus}>
               <input type="hidden" name="id" value={task.id} />
               <input type="hidden" name="status" value="TODO" />
               <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2 text-muted-foreground">تراجع</Button>
             </form>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
