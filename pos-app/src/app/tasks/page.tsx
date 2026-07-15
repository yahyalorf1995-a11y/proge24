import { getTasks, createTask, deleteTask, updateTaskStatus } from "@/features/tasks/actions";
import { getProjects } from "@/features/projects/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Circle, CheckCircle2, Clock } from "lucide-react";
import { JourneyFooter } from "@/components/layout/JourneyFooter";

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
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground mt-2">
          Your daily execution backlog. Link tasks to projects to ensure your work moves the needle.
        </p>
      </div>

      {/* Add New Task Form */}
      <Card className="bg-background border-primary/20 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Quick Add Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createTask} className="flex gap-4 items-start flex-col md:flex-row">
            <div className="flex-1 w-full flex flex-col gap-3">
              <div className="flex gap-4">
                <input
                  name="title"
                  required
                  placeholder="What needs to be done?"
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                <select
                  name="priority"
                  className="flex h-10 w-[140px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  defaultValue="MEDIUM"
                >
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Priority</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              <div className="flex gap-4">
                <input
                  name="description"
                  placeholder="Details (Optional)"
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                <select
                  name="projectId"
                  className="flex h-10 w-[240px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  defaultValue="none"
                >
                  <option value="none">Inbox (No Project)</option>
                  {projects.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <Button type="submit" className="h-[84px] md:w-[120px] w-full">Add Task</Button>
          </form>
        </CardContent>
      </Card>

      {/* Tasks List - Grouped by Status */}
      <div className="grid gap-6 md:grid-cols-3 items-start">
        
        {/* TODO Column */}
        <div className="flex flex-col gap-3 p-4 bg-muted/20 rounded-2xl border border-border/40">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Circle className="w-3.5 h-3.5" /> To Do
            </h3>
            <Badge variant="secondary" className="bg-muted/50 text-[10px] px-1.5">{todoTasks.length}</Badge>
          </div>
          <div className="flex flex-col gap-2.5">
            {todoTasks.map((task: any) => <TaskCard key={task.id} task={task} />)}
            {todoTasks.length === 0 && <p className="text-xs text-muted-foreground text-center py-6 border border-dashed border-border/50 rounded-xl bg-card/50">No tasks to do.</p>}
          </div>
        </div>

        {/* IN PROGRESS Column */}
        <div className="flex flex-col gap-3 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> In Progress
            </h3>
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] px-1.5">{inProgressTasks.length}</Badge>
          </div>
          <div className="flex flex-col gap-2.5">
            {inProgressTasks.map((task: any) => <TaskCard key={task.id} task={task} />)}
            {inProgressTasks.length === 0 && <p className="text-xs text-muted-foreground text-center py-6 border border-dashed border-blue-500/20 rounded-xl bg-card/50">Nothing in progress.</p>}
          </div>
        </div>

        {/* DONE Column */}
        <div className="flex flex-col gap-3 p-4 bg-green-500/5 rounded-2xl border border-green-500/10">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-green-700 dark:text-green-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Done
            </h3>
            <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-500 text-[10px] px-1.5">{doneTasks.length}</Badge>
          </div>
          <div className="flex flex-col gap-2.5">
            {doneTasks.map((task: any) => <TaskCard key={task.id} task={task} />)}
            {doneTasks.length === 0 && <p className="text-xs text-muted-foreground text-center py-6 border border-dashed border-green-500/20 rounded-xl bg-card/50">No tasks completed yet.</p>}
          </div>
        </div>

      </div>

      <JourneyFooter 
        prevLink="/projects" prevLabel="Back to Projects"
        nextLink="/habits" nextLabel="Next Step: Build Habits" 
      />
    </div>
  );
}

// Sub-component for rendering a single task card
function TaskCard({ task }: { task: any }) {
  const isDone = task.status === "DONE";
  
  return (
    <Card className={`relative group ${isDone ? "opacity-60 bg-muted/30 border-border/40" : "bg-card hover:shadow-sm hover:-translate-y-[1px] hover:border-primary/20 border-border/60"} transition-all duration-300 rounded-xl`}>
      <CardContent className="p-4 flex flex-col gap-2.5">
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-col gap-1.5">
            <span className={`text-sm font-medium leading-tight ${isDone ? "line-through text-muted-foreground" : "text-foreground/90"}`}>
              {task.title}
            </span>
            {task.description && (
              <span className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {task.description}
              </span>
            )}
          </div>

          <form action={deleteTask}>
            <input type="hidden" name="id" value={task.id} />
            <Button variant="ghost" size="icon" aria-label="Delete Task" className="h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity shrink-0 hover:bg-destructive/10">
              <Trash2 size={13} />
            </Button>
          </form>
        </div>

        <div className="flex items-center justify-between mt-1 pt-3 border-t border-border/40">
          <div className="flex flex-wrap gap-1.5">
             {task.project && (
               <Badge variant="secondary" className="text-[9px] px-1.5 py-0 font-medium bg-muted/60 text-muted-foreground rounded-sm">
                 {task.project.title.length > 15 ? task.project.title.substring(0, 15) + '...' : task.project.title}
               </Badge>
             )}
             {(task.priority === "HIGH" || task.priority === "URGENT") && (
               <Badge variant="destructive" className="text-[9px] px-1.5 py-0 rounded-sm">{task.priority}</Badge>
             )}
          </div>

          <div className="flex items-center gap-1.5">
            {task.status === "TODO" && (
              <form action={updateTaskStatus}>
                <input type="hidden" name="id" value={task.id} />
                <input type="hidden" name="status" value="IN_PROGRESS" />
                <Button size="sm" variant="outline" className="h-6 text-[10px] px-2.5 rounded-full hover:bg-primary/5 hover:text-primary transition-colors">Start</Button>
              </form>
            )}
            {task.status === "IN_PROGRESS" && (
              <form action={updateTaskStatus}>
                <input type="hidden" name="id" value={task.id} />
                <input type="hidden" name="status" value="DONE" />
                <Button size="sm" className="h-6 text-[10px] px-2.5 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-sm transition-colors">Done</Button>
              </form>
            )}
            {task.status === "DONE" && (
               <form action={updateTaskStatus}>
               <input type="hidden" name="id" value={task.id} />
               <input type="hidden" name="status" value="TODO" />
               <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2.5 rounded-full text-muted-foreground hover:text-foreground transition-colors">Undo</Button>
             </form>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}