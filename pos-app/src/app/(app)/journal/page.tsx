import { getJournalEntries, createJournalEntry, deleteJournalEntry } from "@/features/journal/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, BookOpen } from "lucide-react";

const MOOD_LABELS: Record<string, string> = {
  AWESOME: "رائع 🤩",
  GOOD: "جيد 🙂",
  NEUTRAL: "محايد 😐",
  BAD: "سيء 😞",
  AWFUL: "فظيع 😫",
};

export default async function JournalPage() {
  const entries = await getJournalEntries();
  const today = new Date().toLocaleDateString("ar-SA", { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">اليوميات</h1>
        <p className="text-muted-foreground mt-2">
          دوّن أفكارك، تأمّل في تقدّمك، وفرّغ ذهنك.
        </p>
      </div>

      <Card className="bg-background border-primary/20 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">تدوينة اليوم - {today}</CardTitle>
          <CardDescription>ما الذي يشغل بالك اليوم؟</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createJournalEntry} className="flex flex-col gap-4">
            <textarea
              name="content"
              required
              placeholder="اكتب أفكارك هنا..."
              className="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <div className="flex justify-between items-center">
              <select
                name="mood"
                className="flex h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                defaultValue="GOOD"
              >
                <option value="AWESOME">رائع 🤩</option>
                <option value="GOOD">جيد 🙂</option>
                <option value="NEUTRAL">محايد 😐</option>
                <option value="BAD">سيء 😞</option>
                <option value="AWFUL">فظيع 😫</option>
              </select>
              <Button type="submit">حفظ التدوينة</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 mt-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-muted-foreground" /> تدوينات سابقة
        </h3>
        
        {entries.map((entry: any) => (
          <Card key={entry.id} className="relative group">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">{new Date(entry.date).toLocaleDateString("ar-SA", { weekday: 'long', month: 'short', day: 'numeric' })}</CardTitle>
                <CardDescription className="mt-1">المزاج: <span className="font-medium text-foreground">{MOOD_LABELS[entry.mood] ?? entry.mood}</span></CardDescription>
              </div>
              <form action={deleteJournalEntry}>
                <input type="hidden" name="id" value={entry.id} />
                <Button variant="ghost" size="icon" aria-label="حذف التدوينة" className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={16} />
                </Button>
              </form>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{entry.content}</p>
            </CardContent>
          </Card>
        ))}

        {entries.length === 0 && (
          <div className="py-12 text-center text-muted-foreground border border-dashed rounded-lg">
            يومياتك فارغة حاليًا. ابدأ الكتابة لتبني سجلًا لرحلتك.
          </div>
        )}
      </div>
    </div>
  );
}
