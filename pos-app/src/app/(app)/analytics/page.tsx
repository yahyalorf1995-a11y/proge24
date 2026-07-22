import { getAnalyticsData } from "@/features/analytics/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { JourneyFooter } from "@/components/layout/JourneyFooter";
import { LineChart, CheckCircle, Target, FolderKanban, Flame } from "lucide-react";

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">التحليلات</h1>
        <p className="text-muted-foreground mt-2">
          مقاييس تنفيذك وصحة نظامك العامة.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدّل إنجاز المهام</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.tasks.rate}%</div>
            <p className="text-xs text-muted-foreground">
              {data.tasks.completed} من أصل {data.tasks.total} مهمة مكتملة
            </p>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mt-3">
              <div className="h-full bg-primary" style={{ width: `${data.tasks.rate}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">نجاح الأهداف</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.goals.rate}%</div>
            <p className="text-xs text-muted-foreground">
              {data.goals.completed} من أصل {data.goals.total} هدف مُحقَّق
            </p>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mt-3">
              <div className="h-full bg-primary" style={{ width: `${data.goals.rate}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المشاريع المُنجزة</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.projects.completed}</div>
            <p className="text-xs text-muted-foreground">
              من أصل {data.projects.total} مشروعًا إجمالًا
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي أيام تتابع العادات</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.habits.totalStreaks}</div>
            <p className="text-xs text-muted-foreground">
              إجمالي أيام الاستمرارية المتراكمة
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="w-5 h-5 text-primary" /> نهاية الرحلة
          </CardTitle>
          <CardDescription>
            لقد أنشأت بنجاح نظام التشغيل الشخصي الخاص بك.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            من تأسيس هويتك الأساسية وصياغة دستورك، وصولًا لتتبّع عاداتك اليومية وإدارة مهامك — نظامك الآن مترابط بالكامل. استخدم مركز القيادة (لوحة التحكم) يوميًا للحفاظ على الزخم.
          </p>
        </CardContent>
      </Card>

      <JourneyFooter 
        prevLink="/reviews" prevLabel="العودة للمراجعات"
        nextLink="/" nextLabel="الذهاب لمركز القيادة" 
      />
    </div>
  );
}
