import { getGoals, createGoal, deleteGoal, updateGoalStatus } from "@/features/goals/actions";
import { getLifeAreas } from "@/features/life-areas/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { JourneyFooter } from "@/components/layout/JourneyFooter";

const STATUS_LABELS: Record<string, string> = {
  NOT_STARTED: "لم يبدأ",
  IN_PROGRESS: "قيد التنفيذ",
  ACHIEVED: "مُحقَّق",
};

export default async function GoalsPage() {
  const goals = await getGoals();
  const lifeAreas = await getLifeAreas();

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">الأهداف</h1>
        <p className="text-muted-foreground mt-2">
          حوّل مجالات حياتك إلى أهداف قابلة للتنفيذ. حدّد أهدافًا واضحة وتتبّع تقدّمها.
        </p>
      </div>

      {/* Add New Goal Form */}
      <Card className="bg-background">
        <CardHeader>
          <CardTitle className="text-lg">إنشاء هدف جديد</CardTitle>
          <CardDescription>اربط الهدف بمجال حياة محدد للحفاظ على التوافق.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createGoal} className="flex gap-4 items-start flex-wrap md:flex-nowrap">
            <div className="flex-1 min-w-[200px] flex flex-col gap-2">
              <input
                name="title"
                required
                placeholder="عنوان الهدف (مثال: الجري 10 كم)"
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="flex-1 min-w-[200px] flex flex-col gap-2">
              <input
                name="description"
                placeholder="وصف مختصر..."
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="w-full md:w-auto min-w-[180px] flex flex-col gap-2">
              <select
                name="lifeAreaId"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                defaultValue=""
              >
                <option value="" disabled>اختر مجال حياة</option>
                {lifeAreas.map((la: any) => (
                  <option key={la.id} value={la.id}>{la.title}</option>
                ))}
              </select>
            </div>
            <Button type="submit" className="h-10 w-full md:w-auto">تحديد الهدف</Button>
          </form>
        </CardContent>
      </Card>

      {/* List of Existing Goals */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal: any) => {
          let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "secondary";
          if (goal.status === "ACHIEVED") badgeVariant = "default";
          if (goal.status === "IN_PROGRESS") badgeVariant = "default";
          
          return (
            <Card key={goal.id} className="relative overflow-hidden group hover:border-primary/50 transition-colors flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs font-normal">
                    {goal.lifeArea?.title || "مجال غير معروف"}
                  </Badge>
                  
                  {/* Delete Button */}
                  <form action={deleteGoal}>
                    <input type="hidden" name="id" value={goal.id} />
                    <Button variant="ghost" size="icon" aria-label="حذف الهدف" className="h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" title="حذف الهدف">
                      <Trash2 size={14} />
                    </Button>
                  </form>
                </div>
                <CardTitle className="flex items-start justify-between mt-1">
                  <span>{goal.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription className="line-clamp-2 mb-4">
                  {goal.description || "لا يوجد وصف."}
                </CardDescription>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>التقدّم ({goal.projects?.length || 0} مشاريع)</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all" 
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 pb-4 bg-muted/30 border-t flex justify-between items-center">
                <Badge variant={badgeVariant} className={goal.status === "IN_PROGRESS" ? "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20" : ""}>
                  {STATUS_LABELS[goal.status] ?? goal.status}
                </Badge>

                {/* Status toggles - simple quick actions */}
                <div className="flex gap-1">
                  {goal.status !== "IN_PROGRESS" && goal.status !== "ACHIEVED" && (
                    <form action={updateGoalStatus}>
                      <input type="hidden" name="id" value={goal.id} />
                      <input type="hidden" name="status" value="IN_PROGRESS" />
                      <Button size="sm" variant="outline" className="h-7 text-xs px-2">ابدأ</Button>
                    </form>
                  )}
                  {goal.status === "IN_PROGRESS" && (
                    <form action={updateGoalStatus}>
                      <input type="hidden" name="id" value={goal.id} />
                      <input type="hidden" name="status" value="ACHIEVED" />
                      <Button size="sm" className="h-7 text-xs px-2">تحقيق</Button>
                    </form>
                  )}
                </div>
              </CardFooter>
            </Card>
          );
        })}

        {goals.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-lg">
            لم تُحدَّد أي أهداف بعد. اختر مجال حياة وأنشئ أول هدف أعلاه!
          </div>
        )}
      </div>

      <JourneyFooter 
        prevLink="/life-areas" prevLabel="العودة لمجالات الحياة"
        nextLink="/projects" nextLabel="الخطوة التالية: قسّمها إلى مشاريع" 
      />
    </div>
  );
}
