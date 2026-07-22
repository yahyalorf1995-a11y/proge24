import { getIdentity, updateIdentity } from "@/features/identity/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JourneyFooter } from "@/components/layout/JourneyFooter";

export default async function IdentityPage() {
  const identity = await getIdentity();

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Core Identity</h1>
        <p className="text-muted-foreground mt-2">
          Define who you are and your ultimate mission. This is step 1 of your journey.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mission Statement</CardTitle>
            <CardDescription>
              Your Mission is what you do every day and why you do it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateIdentity} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <textarea
                  id="mission"
                  name="mission"
                  defaultValue={identity?.mission || ""}
                  placeholder="What is your ultimate purpose?"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              <Button type="submit" className="w-fit mt-2">
                Save Mission
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <JourneyFooter 
        nextLink="/constitution" nextLabel="Next Step: Draft Constitution" 
      />
    </div>
  );
}