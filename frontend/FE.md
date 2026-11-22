# FE.md — Planning Frontend Kanban Management System

## 1. Tujuan Frontend

Membangun antarmuka Kanban berbasis **Next.js App Router** yang memungkinkan pengguna login, melihat tugas sesuai divisinya, mengelola tugas, dan (khusus Admin Divisi) mengelola anggota divisi.

Frontend bertanggung jawab atas tampilan, interaksi pengguna, validasi form dasar, serta pengelolaan state. **Frontend bukan penentu hak akses**. Semua izin akses wajib diverifikasi kembali oleh Backend Hono.

## 2. Stack Teknologi

- Next.js App Router
- TypeScript
- Tailwind CSS
- Shadcn/UI
- Zustand
- Fetch API untuk komunikasi dengan Hono
- React Hook Form + Zod (opsional, direkomendasikan untuk form)

## 3. Asumsi dan Keputusan Sementara

1. Frontend dan backend berada dalam **satu repository**.
2. Hono diintegrasikan ke Next.js melalui route adapter, sehingga API dapat dipanggil melalui path relatif `/api/...`.
3. Aplikasi memiliki divisi Marketing dan IT. Daftar divisi sebaiknya tetap berasal dari database, bukan ditanam permanen di frontend.
4. Satu akun hanya terdaftar pada satu divisi.
5. Role awal: `admin` dan `member`.
6. Status task: `todo`, `in_progress`, `done`.
7. Prioritas task: `low`, `medium`, `high`.
8. Session menggunakan cookie `HttpOnly`; token session tidak disimpan di Zustand atau localStorage.
9. Aturan final izin Member untuk mengedit/menghapus task perlu disepakati bersama backend. Rancangan awal: Admin dapat mengelola semua task dalam divisinya; Member hanya dapat mengelola task yang dibuat atau ditugaskan kepadanya.

## 4. Struktur Halaman dan Fitur FE

### 4.1 Halaman Login — `/login`

- [ ] Membuat form email dan password.
- [ ] Validasi field wajib dan format email.
- [ ] Menampilkan kondisi loading saat login.
- [ ] Menampilkan pesan ketika kredensial salah atau server bermasalah.
- [ ] Memanggil `POST /api/auth/login`.
- [ ] Setelah berhasil, mengambil profil melalui `GET /api/auth/me` atau menggunakan data user aman dari respons login.
- [ ] Mengarahkan pengguna ke `/dashboard`.
- [ ] Tidak menyimpan password atau token session ke localStorage/Zustand persist.

**Kriteria selesai:** pengguna dengan akun valid dapat login; akun tidak valid tetap berada di halaman login dan melihat pesan yang sesuai.

### 4.2 Pemeriksaan Session dan Route Protection

- [ ] Saat aplikasi dimuat, auth store memanggil `GET /api/auth/me`.
- [ ] Menampilkan loading sementara status session diperiksa.
- [ ] Jika belum login, arahkan ke `/login`.
- [ ] Jika sudah login, izinkan akses halaman yang sesuai.
- [ ] Jika session tidak valid/kedaluwarsa, bersihkan state user dan arahkan ke `/login`.
- [ ] Sediakan tombol logout yang memanggil `POST /api/auth/logout`.

**Catatan keamanan:** route protection di FE hanya untuk pengalaman pengguna. Hono tetap harus memeriksa session dan izin pada setiap endpoint privat.

### 4.3 Dashboard / Kanban — `/dashboard`

Komponen yang direncanakan:

- [ ] Sidebar navigasi.
- [ ] Header dengan nama pengguna, role, dan divisi.
- [ ] Division badge, misalnya Marketing atau IT.
- [ ] Ringkasan jumlah seluruh task, task berjalan, dan task selesai.
- [ ] Search berdasarkan judul/deskripsi task.
- [ ] Filter status dan prioritas.
- [ ] Board dengan tiga kolom: To Do, In Progress, Done.
- [ ] Task card yang menampilkan judul, prioritas, assignee, dan due date jika tersedia.
- [ ] Empty state saat belum ada task.
- [ ] Loading state dan error state.
- [ ] Refresh atau pemuatan ulang data setelah operasi CRUD.

**Kriteria selesai:** setelah login, pengguna hanya melihat data yang dikembalikan API untuk divisinya. FE tidak boleh menganggap filter divisi di browser sebagai pengamanan data.

### 4.4 Manajemen Task

#### Tambah Task
- [ ] Tombol `Tambah Task`.
- [ ] Dialog/form berisi title, description, priority, assignee (opsional), dan due date (opsional).
- [ ] Status awal default `todo`.
- [ ] Memanggil `POST /api/tasks`.
- [ ] Menampilkan notifikasi berhasil/gagal.
- [ ] Memperbarui daftar task setelah respons sukses.

#### Detail dan Edit Task
- [ ] Dialog/detail task.
- [ ] Menampilkan seluruh informasi task yang tersedia.
- [ ] Form edit title, description, status, priority, assignee, dan due date sesuai izin pengguna.
- [ ] Memanggil `GET /api/tasks/:id` jika detail tidak tersedia dari state.
- [ ] Memanggil `PATCH /api/tasks/:id` untuk perubahan.
- [ ] Menangani respons `403`, `404`, dan error validasi.

#### Hapus Task
- [ ] Dialog konfirmasi penghapusan.
- [ ] Memanggil `DELETE /api/tasks/:id`.
- [ ] Menghapus task dari state hanya setelah server menyatakan operasi berhasil.
- [ ] Menampilkan pesan berhasil/gagal.

#### Perubahan Status
- [ ] Pengguna dapat mengubah status task.
- [ ] Perubahan dapat dilakukan melalui pilihan status atau drag-and-drop jika fitur tersebut diputuskan untuk digunakan.
- [ ] Memanggil `PATCH /api/tasks/:id`.
- [ ] Memperbarui tampilan setelah respons sukses.
- [ ] Jika request gagal, tampilkan pesan dan kembalikan tampilan ke data server terakhir.

### 4.5 Manajemen Anggota — `/members`

Halaman ini ditampilkan untuk Admin Divisi. Member biasa tidak perlu melihat menu ini.

- [ ] Menampilkan daftar anggota dalam divisi admin.
- [ ] Menampilkan nama, email, role, dan status akun.
- [ ] Form tambah anggota.
- [ ] Form ubah role/status anggota sesuai kebijakan.
- [ ] Search anggota jika jumlah anggota mulai banyak.
- [ ] Loading, empty, dan error state.
- [ ] Memanggil endpoint `/api/members`.
- [ ] Menangani `403 Forbidden` jika pengguna bukan admin.

**Catatan:** menyembunyikan menu untuk Member bukan pengganti authorization. Backend wajib memblokir request yang tidak diizinkan.

### 4.6 Profil dan Logout

- [ ] Menampilkan nama, email, role, dan divisi pengguna.
- [ ] Menyediakan tombol logout.
- [ ] Setelah logout berhasil, kosongkan auth state dan kanban state yang sensitif.
- [ ] Arahkan pengguna ke `/login`.

## 5. Rancangan Zustand Store

### 5.1 `auth-store.ts`

State yang disarankan:

```ts
type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loadMe: () => Promise<void>;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
};
```

Tanggung jawab:
- Menyimpan profil pengguna yang aman untuk ditampilkan.
- Memeriksa session melalui `/api/auth/me`.
- Menjalankan login/logout melalui API.
- Mengelola loading dan error autentikasi.
- Tidak menyimpan password, session ID, atau token cookie.

### 5.2 `kanban-store.ts`

State yang disarankan:

```ts
type KanbanState = {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: (filters?: TaskFilters) => Promise<void>;
  fetchTaskById: (id: string) => Promise<Task>;
  addTask: (input: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
};
```

Tanggung jawab:
- Memanggil endpoint task Hono.
- Menyimpan task yang diterima dari server.
- Mengelola loading/error.
- Memperbarui state setelah operasi CRUD berhasil.
- Tidak menentukan atau mengirim `division_id` sebagai dasar hak akses. Divisi ditentukan oleh backend dari session.

### 5.3 `member-store.ts` (opsional)

Bisa dibuat jika halaman anggota cukup kompleks. Untuk MVP, fungsi anggota boleh dikelola langsung di halaman atau service FE tanpa store terpisah.

## 6. Struktur Folder Frontend yang Disarankan

```text
src/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── (protected)/
│   │   ├── dashboard/page.tsx
│   │   └── members/page.tsx
│   ├── layout.tsx
│   └── providers.tsx
├── components/
│   ├── layout/
│   ├── kanban/
│   ├── task/
│   ├── members/
│   └── ui/
├── store/
│   ├── auth-store.ts
│   └── kanban-store.ts
├── services/
│   ├── auth-api.ts
│   ├── task-api.ts
│   └── member-api.ts
├── types/
│   ├── auth.ts
│   ├── task.ts
│   └── member.ts
└── lib/
    ├── utils.ts
    └── validation/
```

## 7. Kontrak Integrasi FE dengan BE

Gunakan path relatif jika Hono berada di Next.js pada origin yang sama.

| Method | Endpoint | Tujuan FE |
|---|---|---|
| POST | `/api/auth/login` | Submit form login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Memulihkan profil/session |
| GET | `/api/tasks` | Memuat board dan filter |
| GET | `/api/tasks/:id` | Memuat detail task |
| POST | `/api/tasks` | Membuat task |
| PATCH | `/api/tasks/:id` | Edit task/perubahan status |
| DELETE | `/api/tasks/:id` | Hapus task |
| GET | `/api/members` | Daftar anggota divisi (admin) |
| POST | `/api/members` | Menambahkan anggota (admin) |
| PATCH | `/api/members/:id` | Mengubah anggota (admin) |
| PATCH | `/api/members/:id/status` | Mengaktifkan/menonaktifkan anggota (admin) |

Untuk request berbasis cookie, gunakan `credentials: 'include'` bila diperlukan oleh konfigurasi origin. Jangan pernah mengirim session token melalui body request atau menyimpannya di localStorage.

Format respons sukses/error perlu mengikuti kontrak yang disepakati di `BE.md`.

## 8. Urutan Pengerjaan FE

### Fase FE-0 — Persiapan
- [ ] Pastikan struktur repository dan integrasi Hono sudah disepakati.
- [ ] Setup Next.js App Router dan TypeScript.
- [ ] Setup Tailwind CSS dan Shadcn/UI.
- [ ] Buat struktur folder FE.
- [ ] Buat tipe `User`, `Task`, dan input API sesuai kontrak backend.

**Output:** kerangka frontend siap dikembangkan.

### Fase FE-1 — Auth
- [ ] Buat halaman login.
- [ ] Buat `auth-store.ts`.
- [ ] Buat service login, logout, dan me.
- [ ] Implementasikan pemeriksaan session.
- [ ] Implementasikan route protection dan logout.

**Output:** pengguna dapat login dan masuk ke halaman terlindungi.

### Fase FE-2 — Kanban Read
- [ ] Buat layout dashboard.
- [ ] Buat ringkasan statistik.
- [ ] Buat tiga kolom Kanban.
- [ ] Buat Task Card.
- [ ] Buat `kanban-store.ts` dan `fetchTasks()`.
- [ ] Implementasikan loading, empty, dan error state.

**Output:** task dari API dapat tampil di board.

### Fase FE-3 — Kanban CRUD
- [ ] Buat dialog tambah task.
- [ ] Buat detail/edit task.
- [ ] Buat konfirmasi hapus.
- [ ] Implementasikan perubahan status.
- [ ] Implementasikan search dan filter.
- [ ] Tes semua operasi terhadap API.

**Output:** fungsi utama Kanban berjalan dari UI ke backend.

### Fase FE-4 — Manajemen Anggota
- [ ] Buat halaman anggota.
- [ ] Batasi tampilan menu berdasarkan role untuk UX.
- [ ] Implementasikan daftar dan form anggota.
- [ ] Tangani response `403` dari backend.

**Output:** Admin Divisi dapat mengelola anggota dalam batas kewenangannya.

### Fase FE-5 — Quality Assurance
- [ ] Tes tampilan desktop dan mobile.
- [ ] Tes loading, empty, error, dan session expired.
- [ ] Tes pengguna Marketing dan IT dengan akun berbeda.
- [ ] Pastikan data dari satu divisi tidak tercampur pada state divisi lain.
- [ ] Tes akses langsung ke halaman/endpoint yang tidak semestinya.
- [ ] Jalankan lint/typecheck/build yang tersedia.

**Output:** frontend siap untuk integrasi akhir dan deployment.

## 9. Checklist Acceptance Criteria FE

- [ ] Pengguna dapat login dan logout.
- [ ] Status session dapat dipulihkan saat halaman di-refresh.
- [ ] Pengguna melihat nama, role, dan divisinya.
- [ ] Board menampilkan task dari API, bukan data dummy permanen.
- [ ] Tambah, detail, edit, hapus, dan perubahan status bekerja.
- [ ] Search dan filter bekerja sesuai kontrak API.
- [ ] Menu anggota hanya ditampilkan sesuai role.
- [ ] Error `401`, `403`, `404`, dan `500` ditangani dengan wajar.
- [ ] FE tidak menyimpan token session di localStorage/Zustand persist.
- [ ] FE tidak mengirim `division_id` sebagai sumber otorisasi.
- [ ] `npm run build` berhasil.

## 10. Hal yang Perlu Diputuskan Sebelum Implementasi

- [ ] Apakah perubahan status menggunakan dropdown/button atau drag-and-drop?
- [ ] Apakah Member boleh mengedit task yang dibuat orang lain jika task ditugaskan kepadanya?
- [ ] Apakah anggota boleh melihat semua task divisi atau hanya task yang terkait dengannya? (Rancangan awal: semua anggota melihat task divisi, tetapi hak edit dibatasi.)
- [ ] Apakah due date dan assignee wajib ada atau opsional?
- [ ] Apakah perlu halaman profil terpisah atau cukup dropdown profil?
