import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-pulse pb-10">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-32 rounded-md" />
        <Skeleton className="h-8 w-64 rounded-md" />
        <Skeleton className="h-4 w-96 rounded-md" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4">
        
        {/* Left Column Skeleton */}
        <div className="md:col-span-12 lg:col-span-7 flex flex-col gap-6">
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <Skeleton className="h-[250px] w-full rounded-xl" />
        </div>

        {/* Right Column Skeleton */}
        <div className="md:col-span-12 lg:col-span-5 flex flex-col gap-6">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
