import { cn } from "@/lib/utils";

export function PromptSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl bg-white border border-accent/50 shadow-sm",
        className
      )}
    >
      {/* Image skeleton */}
      <div className="aspect-square bg-accent-light animate-pulse" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Tags */}
        <div className="flex gap-1.5">
          <div className="h-5 w-16 rounded-full bg-accent/40 animate-pulse" />
          <div className="h-5 w-12 rounded-full bg-accent/40 animate-pulse" />
        </div>

        {/* Title */}
        <div className="h-4 w-3/4 rounded bg-accent/30 animate-pulse" />

        {/* Text lines */}
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-accent/20 animate-pulse" />
          <div className="h-3 w-5/6 rounded bg-accent/20 animate-pulse" />
          <div className="h-3 w-2/3 rounded bg-accent/20 animate-pulse" />
        </div>

        {/* Button */}
        <div className="h-9 w-full rounded-xl bg-primary/20 animate-pulse" />
      </div>
    </div>
  );
}
