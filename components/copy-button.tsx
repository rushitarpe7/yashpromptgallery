"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  className?: string;
  variant?: "icon" | "full";
}

export function CopyButton({
  text,
  className,
  variant = "full",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Prompt copied to clipboard!", {
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy prompt");
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleCopy}
        className={cn(
          "inline-flex items-center justify-center rounded-lg p-2 transition-all duration-200",
          "hover:bg-primary-light/40 active:scale-95",
          "text-muted-foreground hover:text-foreground",
          className
        )}
        aria-label="Copy prompt"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
        "bg-primary text-white hover:bg-primary-light active:scale-95",
        "shadow-sm hover:shadow-md",
        className
      )}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          Copy Prompt
        </>
      )}
    </button>
  );
}
