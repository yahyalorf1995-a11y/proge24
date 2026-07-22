import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface JourneyFooterProps {
  nextLink?: string;
  nextLabel?: string;
  prevLink?: string;
  prevLabel?: string;
}

// Icons are swapped relative to the original LTR version: in RTL reading
// order, "previous" points toward the right (back toward where the reader
// came from) and "next" points toward the left (further into the reading
// flow). Margins use logical `me-`/`ms-` (margin-inline-end/start) instead
// of physical `mr-`/`ml-` so they automatically mirror correctly under the
// app's global `dir="rtl"` without needing a manual swap here.
export function JourneyFooter({ nextLink, nextLabel, prevLink, prevLabel }: JourneyFooterProps) {
  return (
    <div className="flex justify-between items-center mt-12 pt-6 border-t border-border/50">
      {prevLink ? (
        <Link href={prevLink}>
          <Button variant="ghost">
            <ArrowRight className="me-2 h-4 w-4" /> {prevLabel}
          </Button>
        </Link>
      ) : (
        <div />
      )}
      {nextLink && (
        <Link href={nextLink}>
          <Button>
            {nextLabel} <ArrowLeft className="ms-2 h-4 w-4" />
          </Button>
        </Link>
      )}
    </div>
  );
}
