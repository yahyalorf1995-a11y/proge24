import { getAnalyticsData } from "@/features/analytics/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { JourneyFooter } from "@/components/layout/JourneyFooter";
import { LineChart, CheckCircle, Target, FolderKanban, Flame } from "lucide-react";

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Your execution metrics and overall system health.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Task Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.tasks.rate}%</div>
            <p className="text-xs text-muted-foreground">
              {data.tasks.completed} out of {data.tasks.total} tasks completed
            </p>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mt-3">
              <div className="h-full bg-primary" style={{ width: `${data.tasks.rate}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goal Success</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.goals.rate}%</div>
            <p className="text-xs text-muted-foreground">
              {data.goals.completed} out of {data.goals.total} goals achieved
            </p>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mt-3">
              <div className="h-full bg-primary" style={{ width: `${data.goals.rate}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects Delivered</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.projects.completed}</div>
            <p className="text-xs text-muted-foreground">
              Out of {data.projects.total} total projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Habit Streaks</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.habits.totalStreaks}</div>
            <p className="text-xs text-muted-foreground">
              Cumulative days of consistency
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="w-5 h-5 text-primary" /> End of Journey
          </CardTitle>
          <CardDescription>
            You have successfully set up your Personal Operating System.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            From establishing your core Identity and drafting your Constitution, down to tracking your daily Habits and managing Tasks—your system is now fully connected. Use the Command Center (Dashboard) daily to maintain momentum.
          </p>
        </CardContent>
      </Card>

      <JourneyFooter 
        prevLink="/reviews" prevLabel="Back to Reviews"
        nextLink="/" nextLabel="Go to Command Center" 
      />
    </div>
  );
}