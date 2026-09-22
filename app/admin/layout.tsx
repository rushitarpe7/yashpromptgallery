"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, LogOut, ExternalLink } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  // If on login page, render clean layout without the authenticated admin header
  if (isLoginPage) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 flex items-center justify-center p-4">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Admin Header (only on dashboard and management pages) */}
      <header className="sticky top-0 z-50 w-full border-b border-primary-light/40 bg-primary text-white shadow-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 min-w-0">
            <Link href="/admin/dashboard" className="flex items-center gap-2.5 group min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-105">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-lg font-bold tracking-tight text-white leading-tight truncate">
                  Yash's PromptGallery
                </span>
                <span className="text-[11px] font-semibold text-accent-light tracking-wider uppercase">
                  Admin Portal
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 hover:text-white gap-1.5 whitespace-nowrap"
              >
                <ExternalLink className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Live Gallery</span>
              </Button>
            </Link>

            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary transition-all duration-200 gap-1.5 whitespace-nowrap"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
