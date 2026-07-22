import { getIdentity, updateIdentity } from "@/features/identity/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JourneyFooter } from "@/components/layout/JourneyFooter";

export default async function IdentityPage() {
  const identity = await getIdentity();

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">الهوية الأساسية</h1>
        <p className="text-muted-foreground mt-2">
          حدّد من أنت ورسالتك النهائية. هذه هي الخطوة الأولى في رحلتك.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>بيان الرسالة</CardTitle>
            <CardDescription>
              رسالتك هي ما تفعله كل يوم ولماذا تفعله.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateIdentity} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <textarea
                  id="mission"
                  name="mission"
                  defaultValue={identity?.mission || ""}
                  placeholder="ما هو غرضك النهائي؟"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              <Button type="submit" className="w-fit mt-2">
                حفظ الرسالة
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <JourneyFooter 
        nextLink="/constitution" nextLabel="الخطوة التالية: صياغة الدستور" 
      />
    </div>
  );
}
