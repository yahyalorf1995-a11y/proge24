import { getVision, updateVision } from "@/features/vision/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JourneyFooter } from "@/components/layout/JourneyFooter";

export default async function VisionPage() {
  const vision = await getVision();

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vision</h1>
        <p className="text-muted-foreground mt-2">
          Where do you see yourself in the long term? Your vision acts as your North Star.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vision Statement</CardTitle>
          <CardDescription>
            Paint a clear picture of the future you are trying to create.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateVision} className="flex flex-col gap-4">
            <textarea
              name="vision"
              defaultValue={vision}
              placeholder="In 10 years, I will have built..."
              className="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <Button type="submit" className="w-fit">Save Vision</Button>
          </form>
        </CardContent>
      </Card>

      <JourneyFooter 
        prevLink="/constitution" prevLabel="Back to Constitution"
        nextLink="/life-areas" nextLabel="Next Step: Set Life Areas" 
      />
    </div>
  );
}