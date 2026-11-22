import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, Layers, ListTodo, Palette } from "lucide-react";
import { THEME_PALETTE, THEME_FONTS } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ThemeShowcasePage() {
  return (
    <main className="min-h-screen bg-background p-4 sm:p-8 md:p-12">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Navigation & Header */}
        <header className="space-y-4 border-b border-border pb-6">
          <div className="flex items-center justify-between">
            <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                <span>Kembali ke Board</span>
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-palette-olive px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-palette-cream font-heading">
                Design System Locked
              </span>
              <span className="rounded-md bg-palette-sage/20 px-2.5 py-1 text-xs font-semibold text-palette-brown font-heading uppercase">
                /theme
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-wide text-palette-brown font-heading">
              Kunci Tema & Design System
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground font-sans leading-relaxed">
              Halaman khusus ini didedikasikan untuk mengunci dan memantau seluruh token palet warna (<strong className="text-palette-brown">image.png</strong>) dan kombinasi tipografi (<strong className="text-palette-brown">Oswald + Google Sans</strong>).
            </p>
          </div>
        </header>

        {/* 1. Palette Swatches */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-palette-olive" />
            <h2 className="text-xl font-bold uppercase tracking-wider text-palette-brown font-heading">
              Palet Terkunci (image.png)
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Chestnut Brown */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
              <div className="h-20 w-full rounded-lg bg-[#6E3511] shadow-inner" />
              <div>
                <p className="font-heading text-sm font-bold uppercase tracking-wider text-palette-brown">
                  {THEME_PALETTE.brown.name}
                </p>
                <p className="font-mono text-xs font-semibold text-foreground">
                  {THEME_PALETTE.brown.hex}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground leading-normal font-sans">
                  {THEME_PALETTE.brown.usage}
                </p>
              </div>
            </div>

            {/* Sage Olive */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
              <div className="h-20 w-full rounded-lg bg-[#91AC67] shadow-inner" />
              <div>
                <p className="font-heading text-sm font-bold uppercase tracking-wider text-palette-brown">
                  {THEME_PALETTE.sage.name}
                </p>
                <p className="font-mono text-xs font-semibold text-foreground">
                  {THEME_PALETTE.sage.hex}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground leading-normal font-sans">
                  {THEME_PALETTE.sage.usage}
                </p>
              </div>
            </div>

            {/* Forest Olive */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
              <div className="h-20 w-full rounded-lg bg-[#597928] shadow-inner" />
              <div>
                <p className="font-heading text-sm font-bold uppercase tracking-wider text-palette-brown">
                  {THEME_PALETTE.olive.name}
                </p>
                <p className="font-mono text-xs font-semibold text-foreground">
                  {THEME_PALETTE.olive.hex}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground leading-normal font-sans">
                  {THEME_PALETTE.olive.usage}
                </p>
              </div>
            </div>

            {/* Warm Cream */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
              <div className="h-20 w-full rounded-lg border border-border bg-[#FCECD8] shadow-inner" />
              <div>
                <p className="font-heading text-sm font-bold uppercase tracking-wider text-palette-brown">
                  {THEME_PALETTE.cream.name}
                </p>
                <p className="font-mono text-xs font-semibold text-foreground">
                  {THEME_PALETTE.cream.hex}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground leading-normal font-sans">
                  {THEME_PALETTE.cream.usage}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Typography Rules */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-palette-brown" />
            <h2 className="text-xl font-bold uppercase tracking-wider text-palette-brown font-heading">
              Standar Tipografi
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5 space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground font-heading">
                Font Judul & Heading
              </span>
              <p className="font-heading text-2xl font-bold uppercase text-palette-brown">
                {THEME_FONTS.secondary.name} (Condensed Grotesque)
              </p>
              <p className="text-xs text-muted-foreground font-sans">
                Digunakan untuk seluruh tag <code className="text-palette-brown">h1–h6</code>, nama kolom kanban, label formulir, dan angka statistik.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground font-heading">
                Font Teks UI & Body
              </span>
              <p className="font-sans text-2xl font-semibold text-foreground">
                {THEME_FONTS.primary.name} (Clean Geometric)
              </p>
              <p className="text-xs text-muted-foreground font-sans">
                Digunakan untuk deskripsi tugas, teks navigasi, isi tabel, input form, dan seluruh elemen bacaan.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Component Preview */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold uppercase tracking-wider text-palette-brown font-heading">
            Simulasi Tampilan Komponen
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-palette-cream/40 p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-palette-brown/20">
                <div className="flex items-center gap-2">
                  <ListTodo className="h-4 w-4 text-palette-brown" />
                  <h3 className="font-heading text-sm font-bold uppercase text-palette-brown">To Do</h3>
                </div>
                <Badge variant="statusTodo">1</Badge>
              </div>
              <div className="rounded-lg border border-border bg-card p-3.5 space-y-2 shadow-sm">
                <Badge variant="priorityHigh">High</Badge>
                <h4 className="text-xs font-semibold text-foreground">Draft Kampanye Q1</h4>
                <p className="text-[11px] text-muted-foreground">Persiapan materi dan copy iklan.</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-palette-cream/40 p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-palette-olive/30">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-palette-olive" />
                  <h3 className="font-heading text-sm font-bold uppercase text-palette-brown">In Progress</h3>
                </div>
                <Badge variant="statusInProgress">1</Badge>
              </div>
              <div className="rounded-lg border border-border bg-card p-3.5 space-y-2 shadow-sm">
                <Badge variant="priorityMedium">Medium</Badge>
                <h4 className="text-xs font-semibold text-foreground">Integrasi Cookie Auth</h4>
                <p className="text-[11px] text-muted-foreground">Pemeriksaan session HttpOnly.</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-palette-cream/40 p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-palette-sage/40">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-palette-sage" />
                  <h3 className="font-heading text-sm font-bold uppercase text-palette-brown">Done</h3>
                </div>
                <Badge variant="statusDone">1</Badge>
              </div>
              <div className="rounded-lg border border-border bg-card p-3.5 space-y-2 shadow-sm opacity-90">
                <Badge variant="priorityLow">Low</Badge>
                <h4 className="text-xs font-semibold text-foreground line-through">Penguncian Tema</h4>
                <p className="text-[11px] text-muted-foreground">Setup token warna di /theme.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <footer className="flex flex-wrap items-center gap-3 pt-4 border-t border-border">
          <Button asChild className="font-heading uppercase tracking-wider text-xs">
            <Link href="/dashboard">Buka Papan Kanban</Link>
          </Button>
          <Button asChild variant="outline" className="font-heading uppercase tracking-wider text-xs">
            <Link href="/login">Halaman Login</Link>
          </Button>
        </footer>
      </div>
    </main>
  );
}
