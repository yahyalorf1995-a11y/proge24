import { getReviews, createReview, deleteReview } from "@/features/reviews/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, SearchCheck, Trophy, Target, Lightbulb } from "lucide-react";
import { JourneyFooter } from "@/components/layout/JourneyFooter";

const TYPE_LABELS: Record<string, string> = {
  WEEKLY: "أسبوعية",
  MONTHLY: "شهرية",
  QUARTERLY: "ربع سنوية",
  YEARLY: "سنوية",
};

export default async function ReviewsPage() {
  const reviews = await getReviews();

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">مراجعات النظام</h1>
        <p className="text-muted-foreground mt-2">
          خذ خطوة للوراء وحلّل تنفيذك. ما يُقاس يُدار.
        </p>
      </div>

      {/* Add New Review Form */}
      <Card className="bg-background border-primary/20 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">إجراء مراجعة</CardTitle>
          <CardDescription>قيّم فترتك الماضية لتحسين القادمة.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createReview} className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-xs font-medium">نوع المراجعة</label>
                <select name="type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none" defaultValue="WEEKLY">
                  <option value="WEEKLY">مراجعة أسبوعية</option>
                  <option value="MONTHLY">مراجعة شهرية</option>
                  <option value="QUARTERLY">مراجعة ربع سنوية</option>
                  <option value="YEARLY">مراجعة سنوية</option>
                </select>
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-xs font-medium">التقييم العام (1-10)</label>
                <input type="number" name="rating" min="1" max="10" required placeholder="8" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium flex items-center gap-1"><Trophy size={14} className="text-green-500" /> الإنجازات / ماذا سار على ما يُرام؟</label>
              <textarea name="wins" required placeholder="حققت كل أهداف التمرين. أنجزت الميزة الأساسية في العمل..." className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium flex items-center gap-1"><Target size={14} className="text-orange-500" /> التحسينات / أين قصّرت؟</label>
              <textarea name="improvements" required placeholder="قضيت وقتًا زائدًا على مواقع التواصل. فاتتني الروتينات الصباحية مرتين..." className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium flex items-center gap-1"><Lightbulb size={14} className="text-yellow-500" /> الدروس المستفادة / تعديلات للفترة القادمة</label>
              <textarea name="learnings" required placeholder="أحتاج لوضع هاتفي بغرفة أخرى قبل الساعة 9 صباحًا لحماية تركيزي..." className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none" />
            </div>

            <Button type="submit" className="w-full md:w-fit mt-2">تسجيل المراجعة</Button>
          </form>
        </CardContent>
      </Card>

      {/* Past Reviews List */}
      <div className="flex flex-col gap-4 mt-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <SearchCheck className="w-5 h-5 text-muted-foreground" /> المراجعات السابقة
        </h3>
        
        {reviews.map((review: any) => (
          <Card key={review.id} className="relative group hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px] tracking-wider">{TYPE_LABELS[review.type] ?? review.type}</Badge>
                  {review.rating && (
                    <Badge variant={review.rating >= 8 ? "default" : review.rating >= 5 ? "secondary" : "destructive"} className="text-[10px]">
                      التقييم: {review.rating}/10
                    </Badge>
                  )}
                </div>
                <CardDescription className="mt-2 text-xs">
                  {new Date(review.periodStartDate).toLocaleDateString("ar-SA")} — {new Date(review.periodEndDate).toLocaleDateString("ar-SA")}
                </CardDescription>
              </div>
              <form action={deleteReview}>
                <input type="hidden" name="id" value={review.id} />
                <Button variant="ghost" size="icon" aria-label="حذف المراجعة" className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={16} />
                </Button>
              </form>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-green-500/5 p-3 rounded-md border border-green-500/10">
                <p className="font-semibold text-green-700 dark:text-green-400 mb-1 flex items-center gap-1"><Trophy size={14}/> الإنجازات</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{review.wins}</p>
              </div>
              <div className="bg-orange-500/5 p-3 rounded-md border border-orange-500/10">
                <p className="font-semibold text-orange-700 dark:text-orange-400 mb-1 flex items-center gap-1"><Target size={14}/> التحسينات</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{review.improvements}</p>
              </div>
              <div className="bg-yellow-500/5 p-3 rounded-md border border-yellow-500/10">
                <p className="font-semibold text-yellow-700 dark:text-yellow-400 mb-1 flex items-center gap-1"><Lightbulb size={14}/> الدروس المستفادة</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{review.learnings}</p>
              </div>
            </CardContent>
          </Card>
        ))}

        {reviews.length === 0 && (
          <div className="py-12 text-center text-muted-foreground border border-dashed rounded-lg">
            لم تُجرَ أي مراجعة بعد. خذ 10 دقائق نهاية هذا الأسبوع لتسجيل أول مراجعة أسبوعية!
          </div>
        )}
      </div>

      <JourneyFooter 
        prevLink="/habits" prevLabel="العودة للعادات"
        nextLink="/analytics" nextLabel="الخطوة الأخيرة: عرض التحليلات" 
      />
    </div>
  );
}
