"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Plus, Shield, Users, Kanban, Layers } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isCheckingSession, logout } = useAuthStore();

  useEffect(() => {
    if (!isCheckingSession && !isAuthenticated) {
      router.push("/login");
    }
  }, [isCheckingSession, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Memeriksa sesi pengguna...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="border-b border-border bg-card px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-palette-olive text-palette-cream font-heading font-bold">
              KM
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold uppercase tracking-wide text-palette-brown">
                Kanban Portal
              </h1>
              <div className="flex items-center gap-2 text-xs">
                <Badge
                  variant={user.division_id === "div-marketing" ? "marketing" : "it"}
                >
                  {user.division_name || user.division_id}
                </Badge>
                <span className="text-muted-foreground capitalize">Role: {user.role}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-palette-brown">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>

            {user.role === "admin" && (
              <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex gap-1.5">
                <Link href="/members">
                  <Users className="h-3.5 w-3.5" />
                  Anggota
                </Link>
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-1.5 text-xs text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-3.5 w-3.5" />
              Keluar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Workspace */}
      <main className="mx-auto max-w-7xl p-4 sm:p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-wider text-palette-brown">
              Board Tugas Divisi {user.division_name || user.division_id}
            </h2>
            <p className="text-sm text-muted-foreground">
              Selamat datang, {user.name}. Berikut adalah ringkasan pekerjaan divisi Anda.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button className="gap-2 font-heading uppercase text-xs tracking-wider">
              <Plus className="h-4 w-4" />
              Tambah Task Baru
            </Button>
          </div>
        </div>

        {/* Phase Notification / Roadmap Callout */}
        <div className="rounded-xl border border-palette-sage/40 bg-palette-sage/10 p-5 space-y-2">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-palette-olive" />
            <h3 className="font-heading text-base font-bold uppercase text-palette-brown">
              Fase FE-1 (Autentikasi & Session Selesai)
            </h3>
          </div>
          <p className="text-xs text-palette-brown/80">
            Anda berhasil masuk sebagai <strong>{user.name}</strong> ({user.role} - {user.division_name}). Cookie sesi HttpOnly terhubung dan siap mendukung <strong>Fase FE-2 (Kanban Board Read)</strong> untuk menampilkan task live dari API.
          </p>
        </div>
      </main>
    </div>
  );
}
