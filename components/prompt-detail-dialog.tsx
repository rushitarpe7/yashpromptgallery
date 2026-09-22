"use client";

import Image from "next/image";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CopyButton } from "@/components/copy-button";

interface PromptDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: {
    _id: string;
    title?: string;
    promptText: string;
    imageUrl: string;
    category?: string;
    tags?: string[];
    createdAt: string;
  } | null;
}

export function PromptDetailDialog({
  open,
  onOpenChange,
  prompt,
}: PromptDetailDialogProps) {
  if (!prompt) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-accent">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">
            {prompt.title || "AI Generated Prompt"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-accent-light">
            <Image
              src={prompt.imageUrl}
              alt={prompt.title || "AI generated image"}
              fill
              className="object-contain"
              sizes="(max-width: 672px) 100vw, 672px"
            />
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-2">
            {prompt.category && (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {prompt.category}
              </span>
            )}
            {prompt.tags?.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent"
              >
                {tag}
              </span>
            ))}
            <span className="text-xs text-muted-foreground ml-auto">
              {format(new Date(prompt.createdAt), "MMM d, yyyy")}
            </span>
          </div>

          {/* Prompt text */}
          <div className="rounded-xl bg-accent-light/50 border border-accent/30 p-4">
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
              {prompt.promptText}
            </p>
          </div>

          {/* Copy button */}
          <div className="flex justify-end">
            <CopyButton text={prompt.promptText} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
