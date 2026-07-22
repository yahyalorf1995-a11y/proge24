import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface JourneyFooterProps {
  nextLink?: string;
  nextLabel?: string;
  prevLink?: string;
  prevLabel?: string;
}

export function JourneyFooter({ nextLink, nextLabel, prevLink, prevLabel }: JourneyFooterProps) {
  return (
    <div className="flex justify-between items-center mt-12 pt-6 border-t border-border/50">
      {prevLink ? (
        <Link href={prevLink}>
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" /> {prevLabel}
          </Button>
        </Link>
      ) : (
        <div />
      )}
      {nextLink && (
        <Link href={nextLink}>
          <Button>
            {nextLabel} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      )}
    </div>
  );
}
