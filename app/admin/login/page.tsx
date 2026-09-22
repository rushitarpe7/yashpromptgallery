"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Sparkles, Lock, Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loginAction } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md border-accent shadow-xl shadow-primary/5 bg-white rounded-2xl overflow-hidden">
        <div className="h-2 w-full bg-primary" />
        <CardHeader className="space-y-2 text-center pt-8 pb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2 shadow-inner">
            <Sparkles className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-black tracking-tight text-foreground">
            Admin Portal
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Sign in to manage AI prompts, images, and gallery content
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-8">
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2 font-medium">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@promptgallery.com"
                  required
                  autoComplete="email"
                  className="pl-10 h-11 bg-accent-light/30 border-accent focus:border-primary rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                  Password
                </Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="pl-10 h-11 bg-accent-light/30 border-accent focus:border-primary rounded-xl"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 bg-primary text-white hover:bg-primary-light font-bold rounded-xl transition-all duration-200 mt-2 shadow-sm"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <div className="text-center pt-2">
              <Link
                href="/"
                className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                ← Return to Public Gallery
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
