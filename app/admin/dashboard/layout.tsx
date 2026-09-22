"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Sparkles, LogOut, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return <>{children}</>;
}
