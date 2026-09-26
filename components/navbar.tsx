"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sparkles, Menu, X, LogIn, LayoutDashboard, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

export function Navbar({ isLoggedIn }: { isLoggedIn?: boolean }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = pathname.startsWith("/admin");

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky top-0 z-50 w-full border-b border-primary-light/30 bg-primary shadow-lg shadow-primary/10"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-110">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Creative Yash's PromptGallery
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          <Link
            href="/"
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
              pathname === "/"
                ? "bg-white/20 text-white"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            )}
          >
            Gallery
          </Link>
          {!isAdmin && !isLoggedIn && (
            <Link
              href="/admin/login"
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              <LogIn className="h-4 w-4" />
              Admin
            </Link>
          )}
          {!isAdmin && isLoggedIn && (
            <>
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden rounded-xl p-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-primary/95 backdrop-blur-md">
          <nav className="mx-auto max-w-7xl space-y-1 px-4 py-3">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                pathname === "/"
                  ? "bg-white/20 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              Gallery
            </Link>
            {!isAdmin && !isLoggedIn && (
              <Link
                href="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                <LogIn className="h-4 w-4" />
                Admin
              </Link>
            )}
            {!isAdmin && isLoggedIn && (
              <>
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="flex items-center gap-2 w-full text-left rounded-xl px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </motion.header>
  );
}
