"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const promptSchema = z.object({
  title: z.string().optional(),
  promptText: z.string().min(1, "Prompt text is required"),
  category: z.string().optional(),
  tags: z.string().optional(), // comma-separated
});

type PromptFormValues = z.infer<typeof promptSchema>;

interface PromptFormProps {
  defaultValues?: {
    title?: string;
    promptText: string;
    imageUrl: string;
    category?: string;
    tags?: string[];
  };
  onSubmit: (data: PromptFormValues & { imageUrl: string }) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export function PromptForm({
  defaultValues,
  onSubmit,
  onCancel,
  isEditing = false,
}: PromptFormProps) {
  const [imageUrl, setImageUrl] = useState(defaultValues?.imageUrl || "");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PromptFormValues>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      promptText: defaultValues?.promptText || "",
      category: defaultValues?.category || "",
      tags: defaultValues?.tags?.join(", ") || "",
    },
  });

  const uploadFile = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await res.json();
      setImageUrl(data.url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    } finally {
      setUploading(false);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleFormSubmit = async (data: PromptFormValues) => {
    if (!imageUrl) {
      toast.error("Please upload an image");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ ...data, imageUrl });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {/* Image Upload */}
      <div>
        <Label className="text-sm font-medium text-foreground mb-2 block">
          Preview Image *
        </Label>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all duration-200
            ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-accent hover:border-primary/50 hover:bg-accent-light/30"
            }
            ${imageUrl ? "aspect-video" : "min-h-[160px]"}
          `}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                Uploading...
              </span>
            </div>
          ) : imageUrl ? (
            <div className="relative h-full w-full">
              <Image
                src={imageUrl}
                alt="Preview"
                fill
                className="rounded-lg object-contain"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setImageUrl("");
                }}
                className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-white shadow-md hover:bg-destructive/80 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Drop an image here or click to browse
              </span>
              <span className="text-xs text-muted-foreground/60">
                JPEG, PNG, WebP, GIF — max 5MB
              </span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Title */}
      <div>
        <Label htmlFor="title" className="text-sm font-medium text-foreground mb-2 block">
          Title (optional)
        </Label>
        <Input
          id="title"
          placeholder="e.g. Dreamy Sunset Landscape"
          {...register("title")}
          className="bg-white border-accent focus:border-primary"
        />
      </div>

      {/* Prompt Text */}
      <div>
        <Label htmlFor="promptText" className="text-sm font-medium text-foreground mb-2 block">
          Prompt Text *
        </Label>
        <Textarea
          id="promptText"
          placeholder="Enter the full AI prompt text..."
          rows={5}
          {...register("promptText")}
          className="bg-white border-accent focus:border-primary resize-none"
        />
        {errors.promptText && (
          <p className="mt-1 text-xs text-destructive">
            {errors.promptText.message}
          </p>
        )}
      </div>

      {/* Category */}
      <div>
        <Label htmlFor="category" className="text-sm font-medium text-foreground mb-2 block">
          Category (optional)
        </Label>
        <Input
          id="category"
          placeholder="e.g. Landscape, Portrait, Abstract"
          {...register("category")}
          className="bg-white border-accent focus:border-primary"
        />
      </div>

      {/* Tags */}
      <div>
        <Label htmlFor="tags" className="text-sm font-medium text-foreground mb-2 block">
          Tags (optional, comma-separated)
        </Label>
        <Input
          id="tags"
          placeholder="e.g. sunset, dreamy, cinematic"
          {...register("tags")}
          className="bg-white border-accent focus:border-primary"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-accent hover:bg-accent-light"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting || uploading}
          className="bg-primary text-white hover:bg-primary-light"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : isEditing ? (
            "Update Prompt"
          ) : (
            "Create Prompt"
          )}
        </Button>
      </div>
    </form>
  );
}
