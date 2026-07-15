import { getReviews, createReview, deleteReview } from "@/features/reviews/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, SearchCheck, Trophy, Target, Lightbulb } from "lucide-react";
import { JourneyFooter } from "@/components/layout/JourneyFooter";

export default async function ReviewsPage() {
  const reviews = await getReviews();

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Reviews</h1>
        <p className="text-muted-foreground mt-2">
          Step back and analyze your execution. What gets measured gets managed.
        </p>
      </div>

      {/* Add New Review Form */}
      <Card className="bg-background border-primary/20 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Conduct a Review</CardTitle>
          <CardDescription>Evaluate your past period to improve the next one.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createReview} className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-xs font-medium">Review Type</label>
                <select name="type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none" defaultValue="WEEKLY">
                  <option value="WEEKLY">Weekly Review</option>
                  <option value="MONTHLY">Monthly Review</option>
                  <option value="QUARTERLY">Quarterly Review</option>
                  <option value="YEARLY">Yearly Review</option>
                </select>
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-xs font-medium">Overall Rating (1-10)</label>
                <input type="number" name="rating" min="1" max="10" required placeholder="8" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium flex items-center gap-1"><Trophy size={14} className="text-green-500" /> Wins / What went well?</label>
              <textarea name="wins" required placeholder="Hit all my workout targets. Completed the core feature at work..." className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium flex items-center gap-1"><Target size={14} className="text-orange-500" /> Improvements / What fell short?</label>
              <textarea name="improvements" required placeholder="Spent too much time on social media. Missed morning routines twice..." className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium flex items-center gap-1"><Lightbulb size={14} className="text-yellow-500" /> Learnings / Adjustments for next period</label>
              <textarea name="learnings" required placeholder="I need to put my phone in another room before 9 AM to protect my focus..." className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none" />
            </div>

            <Button type="submit" className="w-full md:w-fit mt-2">Log Review</Button>
          </form>
        </CardContent>
      </Card>

      {/* Past Reviews List */}
      <div className="flex flex-col gap-4 mt-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <SearchCheck className="w-5 h-5 text-muted-foreground" /> Historical Reviews
        </h3>
        
        {reviews.map((review: any) => (
          <Card key={review.id} className="relative group hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="uppercase text-[10px] tracking-wider">{review.type}</Badge>
                  {review.rating && (
                    <Badge variant={review.rating >= 8 ? "default" : review.rating >= 5 ? "secondary" : "destructive"} className="text-[10px]">
                      Rating: {review.rating}/10
                    </Badge>
                  )}
                </div>
                <CardDescription className="mt-2 text-xs">
                  {new Date(review.periodStartDate).toLocaleDateString()} — {new Date(review.periodEndDate).toLocaleDateString()}
                </CardDescription>
              </div>
              <form action={deleteReview}>
                <input type="hidden" name="id" value={review.id} />
                <Button variant="ghost" size="icon" aria-label="Delete Review" className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={16} />
                </Button>
              </form>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-green-500/5 p-3 rounded-md border border-green-500/10">
                <p className="font-semibold text-green-700 dark:text-green-400 mb-1 flex items-center gap-1"><Trophy size={14}/> Wins</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{review.wins}</p>
              </div>
              <div className="bg-orange-500/5 p-3 rounded-md border border-orange-500/10">
                <p className="font-semibold text-orange-700 dark:text-orange-400 mb-1 flex items-center gap-1"><Target size={14}/> Improvements</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{review.improvements}</p>
              </div>
              <div className="bg-yellow-500/5 p-3 rounded-md border border-yellow-500/10">
                <p className="font-semibold text-yellow-700 dark:text-yellow-400 mb-1 flex items-center gap-1"><Lightbulb size={14}/> Learnings</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{review.learnings}</p>
              </div>
            </CardContent>
          </Card>
        ))}

        {reviews.length === 0 && (
          <div className="py-12 text-center text-muted-foreground border border-dashed rounded-lg">
            No reviews conducted yet. Take 10 minutes this weekend to log your first weekly review!
          </div>
        )}
      </div>

      <JourneyFooter 
        prevLink="/habits" prevLabel="Back to Habits"
        nextLink="/analytics" nextLabel="Final Step: View Analytics" 
      />
    </div>
  );
}