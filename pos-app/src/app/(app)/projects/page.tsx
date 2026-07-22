import { getProjects, createProject, deleteProject, updateProjectStatus } from "@/features/projects/actions";
import { getLifeAreas } from "@/features/life-areas/actions";
import { getGoals } from "@/features/goals/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, FolderKanban } from "lucide-react";
import { JourneyFooter } from "@/components/layout/JourneyFooter";

export default async function ProjectsPage() {
  const projects = await getProjects();
  const lifeAreas = await getLifeAreas();
  const goals = await getGoals();

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground mt-2">
          Projects are actionable containers for your tasks. Link them to Life Areas and Goals.
        </p>
      </div>

      {/* Add New Project Form */}
      <Card className="bg-background">
        <CardHeader>
          <CardTitle className="text-lg">Create a New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createProject} className="flex gap-4 items-start flex-col md:flex-row">
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="title"
                required
                placeholder="Project Title (e.g., Build Portfolio Website)"
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <input
                name="description"
                placeholder="Short description..."
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              
              <select
                name="lifeAreaId"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                defaultValue=""
              >
                <option value="" disabled>Select Life Area (Required)</option>
                {lifeAreas.map((la: any) => (
                  <option key={la.id} value={la.id}>{la.title}</option>
                ))}
              </select>

              <select
                name="goalId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                defaultValue="none"
              >
                <option value="none">No specific goal (Optional)</option>
                {goals.map((g: any) => (
                  <option key={g.id} value={g.id}>{g.title}</option>
                ))}
              </select>
            </div>
            
            <Button type="submit" className="h-10 w-full md:w-auto mt-4 md:mt-0 whitespace-nowrap">Create Project</Button>
          </form>
        </CardContent>
      </Card>

      {/* List of Existing Projects */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project: any) => {
          let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "secondary";
          if (project.status === "COMPLETED") badgeVariant = "default";
          if (project.status === "ACTIVE") badgeVariant = "default";
          if (project.status === "ON_HOLD") badgeVariant = "destructive";
          
          return (
            <Card key={project.id} className="relative overflow-hidden group hover:border-primary/50 transition-colors flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col gap-1">
                    <Badge variant="outline" className="text-xs font-normal w-fit">
                      {project.lifeArea?.title || "Unknown Area"}
                    </Badge>
                    {project.goal && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        ↳ Goal: {project.goal.title}
                      </span>
                    )}
                  </div>
                  
                  {/* Delete Button */}
                  <form action={deleteProject}>
                    <input type="hidden" name="id" value={project.id} />
                    <Button variant="ghost" size="icon" aria-label="Delete Project" className="h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" title="Delete Project">
                      <Trash2 size={14} />
                    </Button>
                  </form>
                </div>
                <CardTitle className="flex items-start justify-between mt-2 text-lg">
                  <span className="flex items-center gap-2">
                    <FolderKanban size={18} className="text-primary" />
                    {project.title}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription className="line-clamp-2 mb-4">
                  {project.description || "No description provided."}
                </CardDescription>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress ({project.tasks?.length || 0} Tasks)</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all" 
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 pb-4 bg-muted/30 border-t flex justify-between items-center">
                <Badge variant={badgeVariant} className={
                  project.status === "ACTIVE" ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20" : 
                  project.status === "PLANNING" ? "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20" : ""
                }>
                  {project.status.replace("_", " ")}
                </Badge>

                {/* Status toggles - simple quick actions */}
                <div className="flex gap-1">
                  {project.status === "PLANNING" && (
                    <form action={updateProjectStatus}>
                      <input type="hidden" name="id" value={project.id} />
                      <input type="hidden" name="status" value="ACTIVE" />
                      <Button size="sm" variant="outline" className="h-7 text-xs px-2">Start</Button>
                    </form>
                  )}
                  {project.status === "ACTIVE" && (
                    <form action={updateProjectStatus}>
                      <input type="hidden" name="id" value={project.id} />
                      <input type="hidden" name="status" value="COMPLETED" />
                      <Button size="sm" className="h-7 text-xs px-2">Complete</Button>
                    </form>
                  )}
                </div>
              </CardFooter>
            </Card>
          );
        })}

        {projects.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-lg">
            No projects found. Create your first project to start executing!
          </div>
        )}
      </div>

      <JourneyFooter 
        prevLink="/goals" prevLabel="Back to Goals"
        nextLink="/tasks" nextLabel="Next Step: Execute Tasks" 
      />
    </div>
  );
}