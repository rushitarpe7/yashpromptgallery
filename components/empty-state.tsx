import { Search } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "No prompts found",
  description = "Try adjusting your search or filters, or check back later for new prompts.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      {/* Illustration */}
      <div className="relative mb-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent/30">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/50">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        {/* Decorative dots */}
        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary/40 animate-pulse" />
        <div className="absolute -bottom-2 -left-2 h-4 w-4 rounded-full bg-primary-light/50 animate-pulse delay-300" />
        <div className="absolute top-2 -left-3 h-2 w-2 rounded-full bg-accent/60 animate-pulse delay-150" />
      </div>

      <h3 className="mb-2 text-lg font-bold text-foreground">{title}</h3>
      <p className="max-w-sm text-center text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
