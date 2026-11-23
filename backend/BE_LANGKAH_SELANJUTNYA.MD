# Instruksi Langkah Selanjutnya untuk Tim Backend (BE)

Dokumen ini berisi panduan teknis langkah demi langkah yang harus dilakukan oleh **Tim Backend (BE)** untuk menyiapkan database, menjalankan server API Hono, dan mengintegrasikannya dengan Frontend.

---

## Ringkasan Status Frontend
- **Frontend Status:** Selesai 100% dan telah terkompilasi bebas error (`npm run build`).
- **Penyelarasan API Contract:** Seluruh tipe TypeScript, nama properti (*camelCase*), struktur wrapper respon (`{ success, message, data }`), relasi `assignees: TaskAssignee[]`, dan boolean `isActive` pada Frontend sudah **100% diselaraskan dengan kontrak backend di `backend/BE.md`**.

---

## Langkah Teknis yang Harus Dijalankan Tim Backend

### 1. Setup Environment Variables (`.env`)
Masuk ke direktori `backend/kanban-management/`, lalu buat file `.env` (duplikasi dari `.env.example`):

```bash
cd backend/kanban-management
cp .env.example .env
```

Isi konfigurasi pada file `.env`:
```env
# Koneksi Database MySQL
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=<password_mysql_anda>
DB_NAME=kanban_management

# Akun Seed Platform Admin (Opsional / Development)
SEED_PLATFORM_ADMIN_NAME=Super Admin
SEED_PLATFORM_ADMIN_EMAIL=superadmin@kanban.com
SEED_PLATFORM_ADMIN_PASSWORD=password_super_123

# Konfigurasi CORS & Origin Frontend
APP_ORIGIN=http://localhost:3000
CORS_ORIGINS=http://localhost:3000
```

---

### 2. Buat Database, Jalankan Migrasi & Seeding
1. Buat database kosong di MySQL dengan nama `kanban_management`:
   ```sql
   CREATE DATABASE kanban_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Pasang dependensi dan jalankan migrasi skema Drizzle:
   ```bash
   npm install
   npx drizzle-kit migrate
   ```
3. Jalankan skrip seeder data awal:
   ```bash
   npx tsx src/db/seed.ts
   ```
   > **Penting:** Pastikan seeder membuat data divisi (**IT** dan **Marketing**) beserta akun contoh (**Admin** dan **Member** untuk masing-masing divisi).

---

### 3. Jalankan Server API Backend
Jalankan server Hono di port yang berbeda dari Frontend (misalnya port `4000`):
```bash
npm run dev -- -p 4000
```
Pastikan endpoint health-check dapat diakses, misalnya:
`GET http://localhost:4000/api/health`

---

### 4. Informasi yang Perlu Diserahkan ke Tim Frontend (Handoff Checklist)
Setelah server backend dan database aktif, mohon informasikan ke Frontend Developer:
- [ ] **URL Base Backend:** (misal: `http://localhost:4000` atau URL server staging).
- [ ] **Kredensial Akun Demo:** Daftar email dan password hasil seed untuk keperluan pengujian login.
- [ ] **Konfigurasi Cookie Session:** Pastikan cookie session `kanban_session` diset dengan:
  - `httpOnly: true`
  - `sameSite: "Lax"` (atau `"None"` jika cross-origin HTTPS)
  - `path: "/"`
  - `maxAge: 60 * 60 * 24 * 7` (7 hari)

---

## Referensi Terkait
- [backend/BE.md](file:///d:/data%20rayhan/programs/kanban-manegement/backend/BE.md) — Dokumen Perencanaan & Kontrak Endpoint Lengkap.
- [frontend/plan.md](file:///d:/data%20rayhan/programs/kanban-manegement/frontend/plan.md) — Dokumen Penyelarasan Penuh Frontend ke Backend Contract.
