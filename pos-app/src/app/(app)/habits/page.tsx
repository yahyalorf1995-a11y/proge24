import { getHabits, createHabit, toggleHabitCheckIn, deleteHabit } from "@/features/habits/actions";
import { getLifeAreas } from "@/features/life-areas/actions";
import { getGoals } from "@/features/goals/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Flame, Check } from "lucide-react";
import { JourneyFooter } from "@/components/layout/JourneyFooter";

const FREQUENCY_LABELS: Record<string, string> = {
  DAILY: "يومي",
  WEEKLY: "أسبوعي",
};

export default async function HabitsPage() {
  const habits = await getHabits();
  const lifeAreas = await getLifeAreas();
  const goals = await getGoals();

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">العادات</h1>
        <p className="text-muted-foreground mt-2">
          الأنظمة أهم من الأهداف. ابنِ الاستمرارية بتتبّع عاداتك اليومية والأسبوعية.
        </p>
      </div>

      {/* Add New Habit Form */}
      <Card className="bg-background">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">إنشاء عادة جديدة</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createHabit} className="flex gap-4 items-start flex-col md:flex-row">
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="title"
                required
                placeholder="عنوان العادة (مثال: تأمل 10 دقائق)"
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <select
                name="frequency"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                defaultValue="DAILY"
              >
                <option value="DAILY">يومي</option>
                <option value="WEEKLY">أسبوعي</option>
              </select>
              <select
                name="lifeAreaId"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                defaultValue=""
              >
                <option value="" disabled>اختر مجال حياة (مطلوب)</option>
                {lifeAreas.map((la: any) => (
                  <option key={la.id} value={la.id}>{la.title}</option>
                ))}
              </select>
              <select
                name="goalId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                defaultValue="none"
              >
                <option value="none">بدون هدف محدد (اختياري)</option>
                {goals.map((g: any) => (
                  <option key={g.id} value={g.id}>{g.title}</option>
                ))}
              </select>
            </div>
            
            <Button type="submit" className="h-10 w-full md:w-[120px] mt-4 md:mt-0">إضافة عادة</Button>
          </form>
        </CardContent>
      </Card>

      {/* Habits List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit: any) => {
          const isDoneToday = habit.isDoneToday;
          
          return (
            <Card key={habit.id} className={`relative overflow-hidden group transition-colors ${isDoneToday ? "border-green-500/50 bg-green-500/5" : "hover:border-primary/50"}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-[10px] font-normal">
                      {habit.lifeArea?.title || "مجال"}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px] font-normal">
                      {FREQUENCY_LABELS[habit.frequency] ?? habit.frequency}
                    </Badge>
                  </div>
                  
                  {/* Delete Button */}
                  <form action={deleteHabit}>
                    <input type="hidden" name="id" value={habit.id} />
                    <Button variant="ghost" size="icon" aria-label="حذف العادة" className="h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" title="حذف العادة">
                      <Trash2 size={14} />
                    </Button>
                  </form>
                </div>
                <CardTitle className="text-lg mt-1">{habit.title}</CardTitle>
                {habit.description && (
                  <CardDescription className="line-clamp-1 text-xs mt-1">
                    {habit.description}
                  </CardDescription>
                )}
              </CardHeader>
              
              <CardContent className="flex items-center justify-between mt-2 pb-4">
                <div className="flex items-center gap-1.5 text-orange-500 font-medium bg-orange-500/10 px-2.5 py-1 rounded-md">
                  <Flame size={16} className={habit.currentStreak > 0 ? "fill-orange-500" : ""} />
                  <span>{habit.currentStreak} يوم متتالي</span>
                </div>

                <form action={toggleHabitCheckIn}>
                  <input type="hidden" name="id" value={habit.id} />
                  <input type="hidden" name="streak" value={habit.currentStreak} />
                  
                  {isDoneToday ? (
                    <>
                      <input type="hidden" name="status" value="done" />
                      <Button size="sm" variant="outline" className="bg-green-600/10 text-green-600 border-green-600/20 hover:bg-green-600/20 gap-1.5">
                        <Check size={14} /> تم التسجيل
                      </Button>
                    </>
                  ) : (
                    <>
                      <input type="hidden" name="status" value="undone" />
                      <Button size="sm" className="gap-1.5">
                        تسجيل حضور
                      </Button>
                    </>
                  )}
                </form>
              </CardContent>
            </Card>
          );
        })}

        {habits.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-lg">
            لم تُنشأ أي عادة بعد. ابدأ بشيء بسيط وابنِ الاستمرارية!
          </div>
        )}
      </div>

      <JourneyFooter 
        prevLink="/tasks" prevLabel="العودة للمهام"
        nextLink="/reviews" nextLabel="الخطوة التالية: راجع النظام" 
      />
    </div>
  );
}
