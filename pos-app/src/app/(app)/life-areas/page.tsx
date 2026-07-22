import { getLifeAreas, createLifeArea, deleteLifeArea } from "@/features/life-areas/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Heart, Briefcase, Trash2 } from "lucide-react";
import { JourneyFooter } from "@/components/layout/JourneyFooter";

export default async function LifeAreasPage() {
  const lifeAreas = await getLifeAreas();

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Life Areas</h1>
        <p className="text-muted-foreground mt-2">
          Categorize your life to maintain balance. Every goal and project will stem from these areas.
        </p>
      </div>

      {/* Add New Life Area Form */}
      <Card className="bg-background">
        <CardHeader>
          <CardTitle className="text-lg">Add New Area</CardTitle>
          <CardDescription>Create a new dimension of your life to focus on.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createLifeArea} className="flex gap-4 items-start">
            <div className="flex-1 flex flex-col gap-2">
              <input
                name="title"
                required
                placeholder="Title (e.g., Finance, Relationships)"
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="flex-2 flex flex-col gap-2 w-1/2">
              <input
                name="description"
                placeholder="Short description..."
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <Button type="submit" className="h-10">Add Area</Button>
          </form>
        </CardContent>
      </Card>

      {/* List of Existing Life Areas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lifeAreas.map((area: any) => (
          <Card key={area.id} className="relative overflow-hidden group hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  {/* Mock logic to display different icons */}
                  {area.icon === "Heart" ? <Heart size={20} /> : area.icon === "Briefcase" ? <Briefcase size={20} /> : <Target size={20} />}
                </div>
                {/* Delete Button via Server Action */}
                  <form action={deleteLifeArea}>
                  <input type="hidden" name="id" value={area.id} />
                  <Button variant="ghost" size="icon" aria-label="Delete Area" className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity" title="Delete Area">
                    <Trash2 size={16} />
                  </Button>
                </form>
              </div>
              <CardTitle className="mt-4">{area.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="line-clamp-2">
                {area.description || "No description provided."}
              </CardDescription>
            </CardContent>
            <CardFooter className="pt-0 pb-4">
              <div className="flex gap-2">
                <div className="text-[10px] text-muted-foreground font-medium bg-secondary px-2 py-1 rounded-md">
                  {area.goals?.length || 0} Goals
                </div>
                <div className="text-[10px] text-muted-foreground font-medium bg-secondary px-2 py-1 rounded-md">
                  {area.habits?.length || 0} Habits
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}

        {lifeAreas.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-lg">
            No life areas defined yet. Create your first one above!
          </div>
        )}
      </div>

      <JourneyFooter 
        prevLink="/vision" prevLabel="Back to Vision"
        nextLink="/goals" nextLabel="Next Step: Set Goals" 
      />
    </div>
  );
}