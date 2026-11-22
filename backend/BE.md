# BE.md — Planning Backend Kanban Management System

## 1. Tujuan Backend

Membangun backend menggunakan **Hono** untuk menangani autentikasi, session, hak akses berbasis divisi, pengelolaan task Kanban, dan manajemen anggota.

Backend adalah sumber kebenaran untuk data dan keamanan. Semua request privat wajib memeriksa session dan authorization. Frontend/Zustand tidak boleh dipercaya untuk menentukan identitas, role, atau divisi pengguna.

## 2. Stack Teknologi

- Hono
- TypeScript
- Next.js App Router sebagai host aplikasi (satu repository)
- Database relasional: PostgreSQL atau MySQL (pilih satu sebelum implementasi)
- ORM/query builder: pilih satu, misalnya Drizzle ORM atau Prisma
- Zod atau validator Hono untuk validasi request
- Session berbasis cookie `HttpOnly`
- Password hashing menggunakan algoritma yang sesuai untuk password (misalnya Argon2id atau bcrypt dengan konfigurasi aman)

**Keputusan yang belum final:** database dan ORM belum ditetapkan. Jangan membuat implementasi migrasi/seeder sebelum pilihan tersebut disepakati.

## 3. Asumsi dan Aturan Bisnis Awal

1. Satu repository berisi Next.js dan Hono.
2. Hono dihubungkan melalui Next.js App Router catch-all route.
3. Divisi awal: Marketing dan IT. Data divisi tetap disimpan di database.
4. Satu user hanya terdaftar pada satu divisi (`users.division_id`).
5. Role awal: `admin` dan `member`.
6. Belum ada Super Admin lintas divisi pada MVP.
7. Setiap task memiliki `division_id` dan `created_by`.
8. `assigned_to` bersifat opsional.
9. Status task: `todo`, `in_progress`, `done`.
10. Prioritas task: `low`, `medium`, `high`.
11. Semua data task yang dibaca/diubah/dihapus harus dibatasi berdasarkan divisi user yang telah diverifikasi server.
12. Rancangan hak akses awal: Admin dapat mengelola seluruh task di divisinya; Member dapat membuat task dan mengubah/menghapus task yang dibuat atau ditugaskan kepadanya. Aturan final perlu disetujui sebelum middleware authorization dibuat.
13. Admin hanya dapat mengelola anggota dalam divisinya sendiri. Tidak boleh memindahkan user ke divisi lain melalui endpoint biasa.

## 4. Arsitektur Request

```text
Browser / Next.js UI
        |
        v
Zustand Store
        |
        | HTTP + HttpOnly Session Cookie
        v
Next.js API Route Adapter
        |
        v
Hono Application
        |
        +--> Authentication Middleware
        |
        +--> Authorization / Division Scope
        |
        +--> Route Handler
        |
        +--> Service / Business Logic
        |
        v
ORM / Query Layer
        |
        v
Relational Database
```

Untuk integrasi satu repo, route adapter Next.js meneruskan request ke aplikasi Hono. Pastikan metode export `GET`, `POST`, `PATCH`, dan `DELETE` mengikuti adapter Hono/Next.js yang dipilih.

## 5. Rancangan Database

### 5.1 Tabel `divisions`

| Kolom | Tipe konseptual | Aturan |
|---|---|---|
| `id` | UUID/string | Primary key |
| `name` | varchar | Wajib |
| `slug` | varchar | Wajib, unique |
| `created_at` | timestamp | Default waktu sekarang |
| `updated_at` | timestamp | Diperbarui saat record berubah |

Seed awal: Marketing dan IT.

### 5.2 Tabel `users`

| Kolom | Tipe konseptual | Aturan |
|---|---|---|
| `id` | UUID/string | Primary key |
| `division_id` | UUID/string | FK ke `divisions.id`, wajib |
| `name` | varchar | Wajib |
| `email` | varchar | Wajib, unique |
| `password_hash` | varchar | Wajib; jangan simpan password asli |
| `role` | enum/varchar | `admin` atau `member` |
| `is_active` | boolean | Default true |
| `created_at` | timestamp | Default waktu sekarang |
| `updated_at` | timestamp | Diperbarui saat record berubah |

### 5.3 Tabel `tasks`

| Kolom | Tipe konseptual | Aturan |
|---|---|---|
| `id` | UUID/string | Primary key |
| `division_id` | UUID/string | FK ke `divisions.id`, wajib |
| `created_by` | UUID/string | FK ke `users.id`, wajib |
| `assigned_to` | UUID/string | FK ke `users.id`, nullable |
| `title` | varchar | Wajib, tidak boleh kosong |
| `description` | text | Opsional |
| `status` | enum/varchar | `todo`, `in_progress`, `done` |
| `priority` | enum/varchar | `low`, `medium`, `high` |
| `due_date` | date | Opsional |
| `created_at` | timestamp | Default waktu sekarang |
| `updated_at` | timestamp | Diperbarui saat record berubah |

**Aturan integritas penting:** `created_by` dan `assigned_to` harus berasal dari divisi yang sama dengan task. Validasi ini harus dilakukan pada service/backend dan, bila memungkinkan, diperkuat dengan constraint database.

### 5.4 Tabel `sessions`

| Kolom | Tipe konseptual | Aturan |
|---|---|---|
| `id` | UUID/string | Primary key |
| `user_id` | UUID/string | FK ke `users.id` |
| `token_hash` | varchar | Hash token session, unique |
| `expires_at` | timestamp | Wajib |
| `created_at` | timestamp | Default waktu sekarang |

Cookie browser berisi token session acak; database menyimpan hash token tersebut. Jangan simpan token session asli dalam database jika menggunakan pola hash-session.

### 5.5 Relasi

- Satu `division` memiliki banyak `users`.
- Satu `division` memiliki banyak `tasks`.
- Satu `user` memiliki banyak `sessions`.
- Satu `user` dapat membuat banyak `tasks`.
- Satu `user` dapat ditugaskan pada banyak `tasks`.

### 5.6 Indeks dan Constraint yang Disarankan

- Unique index pada `users.email`.
- Unique index pada `divisions.slug`.
- Index `users.division_id`.
- Index gabungan `tasks.division_id` dan `tasks.status`.
- Index `tasks.created_by` dan `tasks.assigned_to`.
- Index unique pada `sessions.token_hash`.
- Foreign key untuk seluruh relasi.
- Pertimbangkan constraint/validasi tambahan untuk memastikan user pembuat dan assignee berada pada divisi task yang sama.

## 6. Authentication dan Session

### 6.1 Login — `POST /api/auth/login`

Alur:
1. Terima email dan password.
2. Validasi format dan field wajib.
3. Cari user berdasarkan email.
4. Pastikan akun aktif.
5. Verifikasi password terhadap `password_hash`.
6. Buat token session acak yang kuat.
7. Simpan hash token beserta `user_id` dan `expires_at` ke tabel `sessions`.
8. Set cookie `HttpOnly`, `Secure` di production, `SameSite` yang sesuai, serta `Path=/` dan expiry yang jelas.
9. Kembalikan profil user yang aman tanpa password hash atau token session.

### 6.2 Memulihkan Session — `GET /api/auth/me`

1. Baca session cookie.
2. Hash token dari cookie dan cari record session.
3. Pastikan session belum kedaluwarsa.
4. Pastikan user masih aktif.
5. Ambil data user dan divisi dari database.
6. Kembalikan profil aman: `id`, `name`, `email`, `role`, `divisionId`, `divisionName`.

### 6.3 Logout — `POST /api/auth/logout`

1. Baca session cookie.
2. Cari dan hapus/revoke session terkait jika valid.
3. Hapus cookie dengan atribut yang sesuai.
4. Kembalikan respons sukses.

### 6.4 Keamanan Session

- Jangan menyimpan token session di Zustand, localStorage, atau sessionStorage.
- Gunakan HTTPS di production.
- Terapkan proteksi CSRF yang sesuai untuk autentikasi cookie; minimal evaluasi `SameSite`, validasi Origin/Referer, dan/atau CSRF token untuk operasi mutasi sesuai arsitektur deployment.
- Batasi percobaan login dan jangan membocorkan apakah email terdaftar atau password yang salah secara terpisah.
- Revoke session saat logout dan saat akun dinonaktifkan.

## 7. Authentication dan Authorization Middleware

### Authentication Middleware

Tugas:
- Membaca dan memvalidasi session cookie.
- Memastikan session valid dan user aktif.
- Mengambil data user terbaru dari database.
- Menyediakan objek user terverifikasi ke route handler.
- Mengembalikan `401 Unauthorized` jika session tidak valid.

### Authorization / Division Scope

Tugas:
- Memastikan role sesuai kebutuhan endpoint.
- Menentukan `division_id` dari user yang telah diverifikasi.
- Memastikan task/member yang diminta berada dalam divisi user.
- Memastikan izin edit/hapus sesuai role dan aturan kepemilikan task.
- Mengembalikan `403 Forbidden` untuk tindakan yang tidak diizinkan. Untuk resource lintas divisi, kebijakan `403` atau `404` perlu konsisten agar tidak membocorkan keberadaan resource.

**Aturan wajib:** jangan menggunakan `division_id` dari request body/query sebagai bukti hak akses. Untuk create task, backend mengisi `division_id` dari user session. Untuk read/update/delete, query harus selalu diberi pembatas divisi yang berasal dari user session.

## 8. API Contract

Gunakan response JSON yang konsisten. Bentuk final dapat berupa:

```json
{
  "success": true,
  "message": "Request berhasil",
  "data": {}
}
```

Format error:

```json
{
  "success": false,
  "message": "Request tidak dapat diproses",
  "errors": []
}
```

### 8.1 Authentication

| Method | Endpoint | Akses | Fungsi |
|---|---|---|---|
| POST | `/api/auth/login` | Publik | Login dan membuat session |
| POST | `/api/auth/logout` | Login | Mengakhiri session |
| GET | `/api/auth/me` | Login | Mengambil profil user dan divisi |

### 8.2 Tasks

| Method | Endpoint | Akses | Fungsi |
|---|---|---|---|
| GET | `/api/tasks` | Login | Daftar task milik divisi user |
| GET | `/api/tasks/:id` | Login + scope divisi | Detail task dalam divisi user |
| POST | `/api/tasks` | Login | Membuat task dalam divisi user |
| PATCH | `/api/tasks/:id` | Login + izin task | Mengubah field task yang diizinkan |
| DELETE | `/api/tasks/:id` | Login + izin task | Menghapus task yang diizinkan |

Query filter yang dapat disediakan pada `GET /api/tasks`:
- `q`: pencarian judul/deskripsi.
- `status`: status task.
- `priority`: prioritas task.
- `assignedTo`: filter assignee jika dibutuhkan.

Semua filter diterapkan **setelah** scope divisi dari session ditentukan. Jangan menerima parameter `divisionId` sebagai cara pengguna berpindah divisi.

### 8.3 Members

| Method | Endpoint | Akses | Fungsi |
|---|---|---|---|
| GET | `/api/members` | Admin divisi | Daftar anggota di divisinya |
| POST | `/api/members` | Admin divisi | Membuat akun anggota dalam divisinya |
| PATCH | `/api/members/:id` | Admin divisi | Mengubah data yang diizinkan |
| PATCH | `/api/members/:id/status` | Admin divisi | Mengaktifkan/menonaktifkan anggota |

Admin tidak boleh mengubah `division_id` dirinya atau anggota melalui endpoint ini. Pembuatan anggota otomatis menggunakan `division_id` admin yang terautentikasi.

## 9. Aturan Validasi dan Hak Akses Task

Validasi dasar:
- `title` wajib, setelah trim tidak boleh kosong, dan memiliki batas panjang.
- `description` opsional dengan batas panjang yang ditentukan.
- `status` hanya menerima `todo`, `in_progress`, `done`.
- `priority` hanya menerima `low`, `medium`, `high`.
- `due_date` harus tanggal yang valid jika dikirim.
- `assigned_to` harus merupakan user aktif dari divisi yang sama.
- Field yang tidak dikenal atau tidak boleh diubah harus ditolak/diabaikan secara aman.

Matriks izin awal (perlu disetujui):

| Aksi | Admin Divisi | Member |
|---|---|---|
| Melihat task divisi | Ya | Ya |
| Membuat task | Ya | Ya |
| Mengubah task divisi | Semua task divisi | Task yang dibuat atau ditugaskan kepadanya |
| Menghapus task divisi | Semua task divisi | Task yang dibuat sendiri |
| Mengelola anggota | Ya, dalam divisinya | Tidak |
| Mengakses divisi lain | Tidak | Tidak |

Jika kebijakan Member berubah, perbarui service, middleware, FE.md, dan test bersama-sama.

## 10. Urutan Pengerjaan Backend

### Fase BE-0 — Finalisasi Desain
- [ ] Konfirmasi satu akun = satu divisi.
- [ ] Konfirmasi role Admin/Member dan aturan izin setiap role.
- [ ] Pilih PostgreSQL atau MySQL.
- [ ] Pilih ORM/query builder.
- [ ] Finalisasi ERD, field, enum, indeks, dan constraint.
- [ ] Samakan API contract dengan tim FE.

**Output:** desain database dan kontrak API disetujui sebelum coding.

### Fase BE-1 — Setup Backend dan Database
- [ ] Setup Hono di Next.js App Router.
- [ ] Setup environment variables.
- [ ] Setup koneksi database.
- [ ] Buat migration `divisions`, `users`, `tasks`, `sessions`.
- [ ] Buat seed divisi Marketing dan IT.
- [ ] Buat seed akun awal hanya untuk development; password harus di-hash.
- [ ] Buat health-check endpoint, misalnya `GET /api/health`.

**Output:** Hono berjalan dan database siap digunakan.

### Fase BE-2 — Authentication
- [ ] Implementasi validasi login.
- [ ] Implementasi password hashing dan verifikasi.
- [ ] Implementasi pembuatan session.
- [ ] Implementasi cookie aman.
- [ ] Implementasi `GET /api/auth/me`.
- [ ] Implementasi logout/revoke session.
- [ ] Implementasi auth middleware.
- [ ] Uji session invalid, expired, dan akun nonaktif.

**Output:** pengguna dapat login, mempertahankan session, dan logout.

### Fase BE-3 — Division Authorization
- [ ] Implementasi pengambilan user dan divisi dari session.
- [ ] Implementasi role check Admin/Member.
- [ ] Implementasi scope divisi pada query task.
- [ ] Pastikan create task menggunakan division user dari session.
- [ ] Pastikan assignee berasal dari divisi yang sama.
- [ ] Pastikan ID task divisi lain tidak dapat dibaca/diubah/dihapus.
- [ ] Buat integration test lintas divisi.

**Output:** isolasi data antar-divisi terbukti melalui pengujian backend.

### Fase BE-4 — Task CRUD
- [ ] Implementasi `GET /api/tasks`.
- [ ] Implementasi filter/search.
- [ ] Implementasi `GET /api/tasks/:id`.
- [ ] Implementasi `POST /api/tasks`.
- [ ] Implementasi `PATCH /api/tasks/:id`.
- [ ] Implementasi `DELETE /api/tasks/:id`.
- [ ] Implementasi validasi request dan response konsisten.
- [ ] Uji semua operasi dengan role dan divisi berbeda.

**Output:** API Kanban siap digunakan FE.

### Fase BE-5 — Member Management
- [ ] Implementasi daftar anggota untuk Admin Divisi.
- [ ] Implementasi pembuatan anggota dalam divisi admin.
- [ ] Hash password awal anggota.
- [ ] Implementasi update field yang diperbolehkan.
- [ ] Implementasi aktivasi/nonaktif akun.
- [ ] Revoke session saat akun dinonaktifkan.
- [ ] Pastikan admin tidak dapat mengelola anggota divisi lain.

**Output:** Admin dapat mengelola anggota di divisinya.

### Fase BE-6 — Security, Testing, dan Deployment
- [ ] Uji `401`, `403`, `404`, `422`, dan `500`.
- [ ] Uji akses lintas divisi untuk GET, POST, PATCH, DELETE.
- [ ] Uji manipulasi `division_id` pada body/query.
- [ ] Uji manipulasi ID task dan ID member.
- [ ] Uji validasi assignee lintas divisi.
- [ ] Evaluasi CSRF, CORS bila beda origin, cookie, dan HTTPS.
- [ ] Jangan commit file `.env` atau kredensial.
- [ ] Tambahkan logging yang tidak mencatat password/token.
- [ ] Jalankan typecheck, test, dan build.
- [ ] Siapkan konfigurasi deployment dan database production.

**Output:** backend siap diintegrasikan dan dideploy.

## 11. Test Case Wajib

### Authentication
- [ ] Login dengan kredensial benar berhasil.
- [ ] Login dengan kredensial salah ditolak.
- [ ] User nonaktif tidak dapat login.
- [ ] Endpoint privat tanpa session mengembalikan `401`.
- [ ] Session kedaluwarsa ditolak.
- [ ] Logout me-revoke session.

### Division Isolation
- [ ] User Marketing hanya menerima task Marketing.
- [ ] User IT hanya menerima task IT.
- [ ] User Marketing tidak dapat membuka detail task IT dengan mengganti ID.
- [ ] User IT tidak dapat mengubah atau menghapus task Marketing.
- [ ] Mengirim `division_id` lain pada POST tidak membuat task di divisi tersebut.
- [ ] Mengubah `division_id` melalui PATCH ditolak/diabaikan sesuai kontrak.
- [ ] Admin Marketing tidak dapat melihat atau mengelola anggota IT.
- [ ] Assignee dari divisi lain tidak dapat ditetapkan pada task.

### CRUD dan Validation
- [ ] Task dapat dibuat dengan data valid.
- [ ] Title kosong ditolak.
- [ ] Status/prioritas di luar enum ditolak.
- [ ] Task dapat diubah oleh role yang berwenang.
- [ ] Task dapat dihapus oleh role yang berwenang.
- [ ] Filter status, prioritas, dan pencarian tidak menghapus scope divisi.

## 12. Struktur Folder Backend yang Disarankan

```text
src/
├── app/
│   └── api/
│       └── [[...route]]/
│           └── route.ts
├── server/
│   ├── app.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── task.routes.ts
│   │   └── member.routes.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   └── permission.middleware.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── task.service.ts
│   │   └── member.service.ts
│   ├── validators/
│   │   ├── auth.schema.ts
│   │   ├── task.schema.ts
│   │   └── member.schema.ts
│   └── types/
│       └── context.ts
├── lib/
│   └── db/
│       ├── index.ts
│       ├── schema/
│       └── migrations/
└── types/
```

Nama dan lokasi folder dapat disesuaikan dengan ORM dan adapter yang dipilih. Jaga agar route handler tipis; aturan bisnis berada di service dan query data dibatasi oleh scope user.

## 13. Checklist Acceptance Criteria BE

- [ ] Hono berjalan melalui Next.js API route.
- [ ] Database memiliki tabel divisions, users, tasks, dan sessions.
- [ ] Password disimpan dalam bentuk hash.
- [ ] Session memakai cookie `HttpOnly` dan dapat direvoke.
- [ ] `/api/auth/me` mengembalikan profil aman beserta divisi.
- [ ] Semua endpoint privat dilindungi authentication middleware.
- [ ] Semua query task dibatasi dengan division dari session.
- [ ] Semua operasi member dibatasi role dan divisi.
- [ ] Client tidak bisa menentukan divisi target melalui request body/query.
- [ ] Error response konsisten dan tidak membocorkan informasi sensitif.
- [ ] Test lintas divisi berhasil membuktikan data terisolasi.
- [ ] Typecheck, test, dan build berhasil.

## 14. Dependensi Pengerjaan dengan FE

1. BE finalisasi tipe `User`, `Task`, request, response, status code, dan aturan akses.
2. FE menggunakan API contract dan tipe yang sama.
3. BE menyediakan endpoint auth lebih dahulu agar FE dapat mengerjakan login/session.
4. BE menyediakan GET task agar FE dapat mengerjakan board.
5. Setelah itu integrasikan POST/PATCH/DELETE dan member management.
6. Setiap perubahan API contract harus dikomunikasikan dan memperbarui FE.md serta BE.md.
