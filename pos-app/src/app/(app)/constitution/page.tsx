import { getConstitution, updateConstitutionSummary, addPrinciple, removePrinciple } from "@/features/constitution/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { JourneyFooter } from "@/components/layout/JourneyFooter";

export default async function ConstitutionPage() {
  const constitution = await getConstitution();

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">الدستور الشخصي</h1>
        <p className="text-muted-foreground mt-2">
          دستورك يحدّد مبادئك الأساسية وقواعدك غير القابلة للتفاوض.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>الملخص / الديباجة</CardTitle>
            <CardDescription>بيان عام يحكم مبادئك.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateConstitutionSummary} className="flex flex-col gap-4">
              <textarea
                name="summary"
                defaultValue={constitution?.summary || ""}
                placeholder="نحن، أصحاب هذا الدستور..."
                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <Button type="submit" className="w-fit">حفظ الملخص</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>المبادئ الأساسية</CardTitle>
            <CardDescription>أضف القواعد التي تعيش بها.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <form action={addPrinciple} className="flex gap-4 items-start flex-col md:flex-row">
              <input name="title" required placeholder="عنوان المبدأ (مثال: التعلّم المستمر)" className="flex h-10 flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm" />
              <input name="description" placeholder="الوصف..." className="flex h-10 flex-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm" />
              <Button type="submit" className="h-10">إضافة مبدأ</Button>
            </form>

            <div className="mt-4 flex flex-col gap-3">
              {constitution.principles?.map((p: any) => (
                <div key={p.id} className="flex justify-between items-start p-3 border rounded-md bg-muted/20">
                  <div>
                    <h4 className="font-semibold text-sm">{p.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
                  </div>
                  <form action={removePrinciple}>
                    <input type="hidden" name="id" value={p.id} />
                    <Button variant="ghost" size="icon" aria-label="حذف المبدأ" className="h-6 w-6 text-destructive shrink-0">
                      <Trash2 size={14} />
                    </Button>
                  </form>
                </div>
              ))}
              {(!constitution.principles || constitution.principles.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">لم تُحدَّد أي مبادئ بعد.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <JourneyFooter 
        prevLink="/identity" prevLabel="العودة للهوية"
        nextLink="/vision" nextLabel="الخطوة التالية: حدّد الرؤية" 
      />
    </div>
  );
}
