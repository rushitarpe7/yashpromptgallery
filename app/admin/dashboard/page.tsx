"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Plus, Pencil, Trash2, Search, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PromptForm } from "@/components/prompt-form";

interface Prompt {
  _id: string;
  title?: string;
  promptText: string;
  imageUrl: string;
  category?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboardPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal states
  const [formOpen, setFormOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

  // Delete dialog states
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch prompts
  const fetchPrompts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);

      const res = await fetch(`/api/prompts?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load prompts");
      const data = await res.json();
      setPrompts(data.prompts || []);
    } catch (error) {
      toast.error("Failed to load prompts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPrompts();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchPrompts]);

  // Handle Create / Update
  const handleFormSubmit = async (formData: {
    title?: string;
    promptText: string;
    imageUrl: string;
    category?: string;
    tags?: string;
  }) => {
    try {
      const payload = {
        title: formData.title,
        promptText: formData.promptText,
        imageUrl: formData.imageUrl,
        category: formData.category,
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      };

      if (editingPrompt) {
        // Update
        const res = await fetch(`/api/prompts/${editingPrompt._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Update failed");
        }

        toast.success("Prompt updated successfully!");
      } else {
        // Create
        const res = await fetch("/api/prompts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Creation failed");
        }

        toast.success("Prompt created successfully!");
      }

      setFormOpen(false);
      setEditingPrompt(null);
      fetchPrompts();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An error occurred"
      );
      throw error;
    }
  };

  // Handle Delete Confirmation
  const confirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/prompts/${deletingId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete");
      }

      toast.success("Prompt deleted successfully!");
      setDeleteOpen(false);
      setDeletingId(null);
      fetchPrompts();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete prompt"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const openCreateModal = () => {
    setEditingPrompt(null);
    setFormOpen(true);
  };

  const openEditModal = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setFormOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-accent/40 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Prompt Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create, edit, and organize prompt cards for the public gallery.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          className="bg-primary hover:bg-primary-light text-white font-semibold rounded-xl shadow-md gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Prompt
        </Button>
      </div>

      {/* Filter / Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts by title, text, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 bg-white border-accent rounded-xl shadow-sm focus:border-primary"
          />
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {prompts.length} total prompt{prompts.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-accent/50 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-accent-light/40">
            <TableRow className="border-b border-accent/40">
              <TableHead className="w-20 font-bold text-foreground">Preview</TableHead>
              <TableHead className="font-bold text-foreground">Title & Prompt</TableHead>
              <TableHead className="font-bold text-foreground hidden md:table-cell">
                Category / Tags
              </TableHead>
              <TableHead className="font-bold text-foreground hidden sm:table-cell w-32">
                Date Added
              </TableHead>
              <TableHead className="w-28 text-right font-bold text-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-36 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span>Loading prompts...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : prompts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-36 text-center text-muted-foreground">
                  No prompts found. Click &quot;Add New Prompt&quot; to get started!
                </TableCell>
              </TableRow>
            ) : (
              prompts.map((prompt) => (
                <TableRow key={prompt._id} className="hover:bg-accent-light/20 border-b border-accent/20">
                  {/* Image Thumbnail */}
                  <TableCell>
                    <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-accent-light border border-accent/50">
                      <Image
                        src={prompt.imageUrl}
                        alt={prompt.title || "Prompt thumbnail"}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                  </TableCell>

                  {/* Title & Prompt text */}
                  <TableCell className="max-w-md">
                    {prompt.title && (
                      <p className="font-semibold text-foreground text-sm line-clamp-1 mb-0.5">
                        {prompt.title}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-sans">
                      {prompt.promptText}
                    </p>
                  </TableCell>

                  {/* Category & Tags */}
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {prompt.category && (
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                          {prompt.category}
                        </span>
                      )}
                      {prompt.tags?.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-accent/40 px-2 py-0.5 text-[11px] text-foreground/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </TableCell>

                  {/* Date */}
                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                    {prompt.createdAt
                      ? format(new Date(prompt.createdAt), "MMM d, yyyy")
                      : "—"}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(prompt)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent-light"
                        title="Edit Prompt"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(prompt._id)}
                        className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                        title="Delete Prompt"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-accent rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-foreground">
              {editingPrompt ? "Edit Prompt Card" : "Add New Prompt Card"}
            </DialogTitle>
          </DialogHeader>

          <PromptForm
            isEditing={!!editingPrompt}
            defaultValues={
              editingPrompt
                ? {
                    title: editingPrompt.title,
                    promptText: editingPrompt.promptText,
                    imageUrl: editingPrompt.imageUrl,
                    category: editingPrompt.category,
                    tags: editingPrompt.tags,
                  }
                : undefined
            }
            onSubmit={handleFormSubmit}
            onCancel={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-white border-accent rounded-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-foreground">
              Are you sure you want to delete this prompt?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              This action cannot be undone. This prompt card and its preview image
              will be permanently removed from the public gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0 mt-4">
            <AlertDialogCancel
              disabled={isDeleting}
              className="border-accent hover:bg-accent-light rounded-xl"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90 text-white rounded-xl"
            >
              {isDeleting ? "Deleting..." : "Yes, Delete Prompt"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
