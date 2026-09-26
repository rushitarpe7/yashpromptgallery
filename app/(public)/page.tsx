"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PromptCard } from "@/components/prompt-card";
import { PromptDetailDialog } from "@/components/prompt-detail-dialog";
import { PromptSkeleton } from "@/components/prompt-skeleton";
import { EmptyState } from "@/components/empty-state";

interface Prompt {
  _id: string;
  title?: string;
  promptText: string;
  imageUrl: string;
  category?: string;
  tags?: string[];
  createdAt: string;
}

interface PromptResponse {
  prompts: Prompt[];
  total: number;
  page: number;
  totalPages: number;
}

export default function GalleryPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch prompts
  const fetchPrompts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (selectedCategory) params.set("category", selectedCategory);
      params.set("page", page.toString());

      const res = await fetch(`/api/prompts?${params.toString()}`);
      const data: PromptResponse = await res.json();

      setPrompts(data.prompts);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (error) {
      console.error("Failed to fetch prompts:", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedCategory, page]);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  // Fetch categories (from all prompts)
  useEffect(() => {
    fetch("/api/prompts?page=1")
      .then((res) => res.json())
      .then((data: PromptResponse) => {
        const cats = [
          ...new Set(
            data.prompts
              .map((p) => p.category)
              .filter((c): c is string => !!c)
          ),
        ];
        setCategories(cats);
      })
      .catch(() => {});
  }, []);

  const handleView = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-white to-accent/10 py-16 sm:py-20">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 via-white/50 to-accent/10 backdrop-blur-md px-5 py-2 text-sm font-bold text-primary mb-6 shadow-sm border border-primary/20 hover:border-primary/40 hover:bg-white/80 transition-all duration-300 hover:scale-105 hover:shadow-md cursor-default"
          >
            <Zap className="h-4 w-4 animate-pulse text-primary" />
            <span className="font-semibold text-primary">
              🚀 The Ultimate AI Prompt Collection
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Discover & Copy{" "}
            <span className="text-gradient block mt-1">
              AI Image Prompts
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg font-medium text-foreground/80"
          >
            Browse our curated collection of AI art prompts. Find the perfect prompt,
            copy it, and create stunning images with Midjourney, DALL·E, or Stable Diffusion.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto mt-8 max-w-xl"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="gallery-search"
                type="text"
                placeholder="Search prompts by keyword, style, or subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 rounded-2xl bg-white/80 backdrop-blur-sm border-accent pl-12 pr-4 text-base shadow-lg shadow-primary/5 focus:border-primary focus:ring-primary/20 transition-all duration-300 focus:scale-[1.02]"
              />
            </div>
          </motion.div>

          {/* Category filters */}
          {categories.length > 0 && (
            <div className="mx-auto mt-4 flex flex-wrap justify-center gap-2 max-w-2xl">
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setPage(1);
                }}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                  selectedCategory === ""
                    ? "bg-primary text-white shadow-md"
                    : "bg-white/60 text-muted-foreground hover:bg-white hover:text-foreground"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setPage(1);
                  }}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                    selectedCategory === cat
                      ? "bg-primary text-white shadow-md"
                      : "bg-white/60 text-muted-foreground hover:bg-white hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Results count */}
        {!loading && (
          <p className="mb-6 text-sm text-muted-foreground">
            {total} prompt{total !== 1 ? "s" : ""} found
            {debouncedSearch && ` for "${debouncedSearch}"`}
            {selectedCategory && ` in ${selectedCategory}`}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <PromptSkeleton key={i} />
            ))}
          </div>
        ) : prompts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {prompts.map((prompt) => (
              <PromptCard
                key={prompt._id}
                id={prompt._id}
                title={prompt.title}
                promptText={prompt.promptText}
                imageUrl={prompt.imageUrl}
                category={prompt.category}
                tags={prompt.tags}
                onView={() => handleView(prompt)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="border-accent hover:bg-accent-light"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - page) <= 1
                )
                .map((p, idx, arr) => (
                  <span key={p} className="flex items-center">
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="px-1 text-muted-foreground">…</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 ${
                        p === page
                          ? "bg-primary text-white shadow-md"
                          : "text-muted-foreground hover:bg-accent-light hover:text-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="border-accent hover:bg-accent-light"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </section>

      {/* Detail Dialog */}
      <PromptDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        prompt={selectedPrompt}
      />
    </div>
  );
}
