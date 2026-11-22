"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, LogOut, Palette, Plus, Users } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useKanbanStore } from "@/store/kanban-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KanbanStats } from "@/components/kanban/kanban-stats";
import { KanbanFilterBar } from "@/components/kanban/kanban-filter-bar";
import { KanbanColumn } from "@/components/kanban/kanban-column";
import { CreateTaskDialog } from "@/components/task/create-task-dialog";
import { TaskDetailDialog } from "@/components/task/task-detail-dialog";
import { DeleteTaskDialog } from "@/components/task/delete-task-dialog";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isCheckingSession, logout } = useAuthStore();
  const { tasks, isLoading, error, fetchTasks, openCreate } = useKanbanStore();

  useEffect(() => {
    if (!isCheckingSession && !isAuthenticated) {
      router.push("/login");
    }
  }, [isCheckingSession, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated, fetchTasks]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground font-sans">
        Memeriksa sesi login...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const todoTasks = tasks.filter((t) => t.status === "todo");
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress");
  const doneTasks = tasks.filter((t) => t.status === "done");

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="border-b border-border bg-card px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-palette-olive text-palette-cream font-heading font-bold text-sm">
              KM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-lg font-bold uppercase tracking-wide text-palette-brown">
                  Kanban Board
                </h1>
                <Badge variant={user.division_id === "div-marketing" ? "marketing" : "it"}>
                  {user.division_name || user.division_id}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground capitalize">
                {user.role} Divisi
              </p>
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
                  Kelola Anggota
                </Link>
              </Button>
            )}

            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex gap-1.5 text-xs text-muted-foreground hover:text-palette-brown">
              <Link href="/theme">
                <Palette className="h-3.5 w-3.5" />
                Kunci Tema
              </Link>
            </Button>

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

      {/* Main Workspace */}
      <main className="mx-auto max-w-7xl p-4 sm:p-6 space-y-6">
        {/* Workspace Title & Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-wider text-palette-brown">
              Papan Kerja {user.division_name || user.division_id}
            </h2>
            <p className="text-sm text-muted-foreground">
              Kelola tugas, delegasikan pekerjaan, dan perbarui progres divisi secara langsung.
            </p>
          </div>

          <Button
            onClick={openCreate}
            className="gap-2 font-heading uppercase text-xs tracking-wider shrink-0"
          >
            <Plus className="h-4 w-4" />
            Tambah Tugas
          </Button>
        </div>

        {/* Metric Statistics */}
        <KanbanStats tasks={tasks} />

        {/* Filter & Search Bar */}
        <KanbanFilterBar />

        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            className="flex items-center gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 3 Columns Kanban Board */}
        {isLoading && tasks.length === 0 ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {[1, 2, 3].map((col) => (
              <div
                key={col}
                className="h-[400px] rounded-xl border border-border bg-palette-cream/20 animate-pulse p-4"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 items-start">
            <KanbanColumn
              status="todo"
              title="To Do"
              tasks={todoTasks}
              count={todoTasks.length}
            />
            <KanbanColumn
              status="in_progress"
              title="In Progress"
              tasks={inProgressTasks}
              count={inProgressTasks.length}
            />
            <KanbanColumn
              status="done"
              title="Done"
              tasks={doneTasks}
              count={doneTasks.length}
            />
          </div>
        )}
      </main>

      {/* CRUD Modals */}
      <CreateTaskDialog />
      <TaskDetailDialog />
      <DeleteTaskDialog />
    </div>
  );
}
