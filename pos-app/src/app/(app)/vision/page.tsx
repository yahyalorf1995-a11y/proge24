import { getVision, updateVision } from "@/features/vision/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JourneyFooter } from "@/components/layout/JourneyFooter";

export default async function VisionPage() {
  const vision = await getVision();

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">الرؤية</h1>
        <p className="text-muted-foreground mt-2">
          أين ترى نفسك على المدى البعيد؟ رؤيتك تعمل كنجمك الشمالي الذي يهديك الطريق.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>بيان الرؤية</CardTitle>
          <CardDescription>
            ارسم صورة واضحة للمستقبل الذي تسعى لبنائه.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateVision} className="flex flex-col gap-4">
            <textarea
              name="vision"
              defaultValue={vision}
              placeholder="خلال 10 سنوات، سأكون قد بنيت..."
              className="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <Button type="submit" className="w-fit">حفظ الرؤية</Button>
          </form>
        </CardContent>
      </Card>

      <JourneyFooter 
        prevLink="/constitution" prevLabel="العودة للدستور"
        nextLink="/life-areas" nextLabel="الخطوة التالية: حدّد مجالات الحياة" 
      />
    </div>
  );
}
