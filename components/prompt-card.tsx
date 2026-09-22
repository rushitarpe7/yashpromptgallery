"use client";

import Image from "next/image";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";
import { CopyButton } from "@/components/copy-button";
import { cn } from "@/lib/utils";

interface PromptCardProps {
  id: string;
  title?: string;
  promptText: string;
  imageUrl: string;
  category?: string;
  tags?: string[];
  onView?: () => void;
}

export function PromptCard({
  title,
  promptText,
  imageUrl,
  category,
  tags,
  onView,
}: PromptCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl",
        "bg-white border border-accent/50",
        "shadow-sm hover:shadow-2xl hover:shadow-primary/20",
        "transition-shadow duration-300"
      )}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-accent-light">
        <Image
          src={imageUrl}
          alt={title || "AI generated image"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* View button overlay */}
        <button
          onClick={onView}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="View prompt details"
        >
          <div className="flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-foreground shadow-lg transition-transform hover:scale-105">
            <Eye className="h-4 w-4" />
            View Details
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category & Tags */}
        {(category || (tags && tags.length > 0)) && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {category && (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {category}
              </span>
            )}
            {tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        {title && (
          <h3 className="mb-1 text-sm font-bold text-foreground line-clamp-1">
            {title}
          </h3>
        )}

        {/* Prompt text */}
        <p className="mb-3 flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-3">
          {promptText}
        </p>

        {/* Copy button */}
        <CopyButton text={promptText} />
      </div>
    </motion.div>
  );
}
