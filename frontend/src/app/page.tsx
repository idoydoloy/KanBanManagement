import Link from "next/link";
import { CheckCircle2, Clock, ListTodo } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background p-6 md:p-12">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Header Preview */}
        <header className="space-y-3 border-b border-border pb-6">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-palette-olive px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-palette-cream">
              Design System Locked
            </span>
            <span className="rounded-md bg-palette-sage/20 px-2.5 py-1 text-xs font-medium text-palette-brown">
              Kanban Theme
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wide text-palette-brown">
            Kanban Management System
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground">
            Tema warna dan tipografi telah dikunci secara konsisten menggunakan Google Sans untuk teks UI dan Oswald untuk judul.
          </p>
        </header>

        {/* Palette Showcase */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold uppercase tracking-wider text-palette-brown">
            Palet Terkunci (image.png)
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="h-16 w-full rounded bg-[#6E3511]" />
              <p className="mt-2 font-heading text-sm font-semibold uppercase text-palette-brown">Chestnut Brown</p>
              <p className="text-xs text-muted-foreground">#6E3511 (Text & Headings)</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="h-16 w-full rounded bg-[#91AC67]" />
              <p className="mt-2 font-heading text-sm font-semibold uppercase text-palette-brown">Sage Olive</p>
              <p className="text-xs text-muted-foreground">#91AC67 (Badges & Columns)</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="h-16 w-full rounded bg-[#597928]" />
              <p className="mt-2 font-heading text-sm font-semibold uppercase text-palette-brown">Forest Olive</p>
              <p className="text-xs text-muted-foreground">#597928 (Primary CTA)</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="h-16 w-full rounded border border-border bg-[#FCECD8]" />
              <p className="mt-2 font-heading text-sm font-semibold uppercase text-palette-brown">Warm Cream</p>
              <p className="text-xs text-muted-foreground">#FCECD8 (Canvas & Surface)</p>
            </div>
          </div>
        </section>

        {/* Kanban Board Sample Columns */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold uppercase tracking-wider text-palette-brown">
            Simulasi Tampilan Komponen Kanban
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Column 1: Todo */}
            <div className="rounded-xl border border-border bg-palette-cream/40 p-4">
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <ListTodo className="h-5 w-5 text-palette-brown" />
                  <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-palette-brown">
                    To Do
                  </h3>
                </div>
                <span className="rounded-full bg-palette-sage/30 px-2 py-0.5 text-xs font-semibold text-palette-brown">
                  2
                </span>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                  <span className="rounded bg-palette-sage/20 px-2 py-0.5 text-xs font-medium text-palette-brown">
                    Marketing
                  </span>
                  <h4 className="mt-2 text-sm font-semibold text-foreground">
                    Buat Draft Campaign Q1
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Menyiapkan materi promosi dan copy sosial media.
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-heading uppercase text-palette-brown font-semibold">Priority: High</span>
                    <span>12 Des</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: In Progress */}
            <div className="rounded-xl border border-border bg-palette-cream/40 p-4">
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-palette-olive" />
                  <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-palette-brown">
                    In Progress
                  </h3>
                </div>
                <span className="rounded-full bg-palette-olive/20 px-2 py-0.5 text-xs font-semibold text-palette-olive">
                  1
                </span>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                  <span className="rounded bg-palette-olive/15 px-2 py-0.5 text-xs font-medium text-palette-olive">
                    IT Team
                  </span>
                  <h4 className="mt-2 text-sm font-semibold text-foreground">
                    Setup Auth Endpoint Hono
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Integrasi session HttpOnly cookie dan middleware auth.
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-heading uppercase text-palette-olive font-semibold">Priority: Medium</span>
                    <span>10 Des</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Done */}
            <div className="rounded-xl border border-border bg-palette-cream/40 p-4">
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-palette-olive" />
                  <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-palette-brown">
                    Done
                  </h3>
                </div>
                <span className="rounded-full bg-palette-sage/30 px-2 py-0.5 text-xs font-semibold text-palette-brown">
                  1
                </span>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg border border-border bg-card p-4 shadow-sm opacity-90">
                  <span className="rounded bg-palette-sage/20 px-2 py-0.5 text-xs font-medium text-palette-brown">
                    Design
                  </span>
                  <h4 className="mt-2 text-sm font-semibold text-foreground line-through">
                    Kunci Tema Warna & Tipografi
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Implementasi Google Sans + Oswald dan palet image.png.
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-heading uppercase text-palette-sage font-semibold">Completed</span>
                    <span>Hari ini</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Actions */}
        <section className="flex flex-wrap items-center gap-4 pt-4">
          <Link
            href="/login"
            className="rounded-lg bg-palette-olive px-6 py-2.5 text-sm font-medium text-palette-cream shadow transition hover:bg-palette-olive/90"
          >
            Halaman Login
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-palette-brown/30 bg-card px-6 py-2.5 text-sm font-medium text-palette-brown transition hover:bg-palette-cream"
          >
            Buka Board Kanban
          </Link>
          <Link
            href="/members"
            className="rounded-lg border border-border bg-card px-6 py-2.5 text-sm font-medium text-palette-brown transition hover:bg-palette-cream"
          >
            Kelola Anggota (Admin)
          </Link>
        </section>
      </div>
    </main>
  );
}
