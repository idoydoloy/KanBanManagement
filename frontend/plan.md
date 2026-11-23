# Plan Penyelarasan Penuh (Full Alignment) Frontend ke API Contract Backend

Dokumen ini menjabarkan rencana teknis menyeluruh untuk menyelaraskan model data, tipe data TypeScript, struktur respons (*envelope*), dan mock API pada frontend Next.js 15 agar **100% identik dan kompatibel penuh** dengan API Contract resmi backend Hono (`backend/kanban-management/src/server/` & `backend/BE.md`).

---

## 1. Latar Belakang & Tujuan

Saat ini frontend menggunakan mock API sementara dengan struktur *snake_case* dan mengembalikan data mentah (*flat response*). Sementara itu, backend resmi telah selesai dibangun menggunakan arsitektur **Hono + Drizzle ORM** dengan standar:
- Standar penamaan properti: **camelCase** (misal: `divisionId`, `dueDate`, `createdBy`, `isActive`).
- Pembungkus respons seragam (*Standard Response Envelope*): `{ success: true, message: string, data: T }`.
- Dukungan relasi tugas: **Array Assignees** (`assignees: TaskAssignee[]`) menggantikan satu string assignee.
- Manajemen status anggota: Boolean flag `{ isActive: boolean }`.
- Parameter pencarian tugas: `q` (bukan `search`).

Dengan melakukan **Opsi A (Full Alignment)**:
1. Tidak ada kesenjangan (*gap*) struktur data antara frontend dan backend.
2. Ketika backend dinyalakan secara live, proses migrasi (*cutover*) dari mock ke live API tidak memerlukan perubahan kode di komponen UI maupun store.
3. Kepatuhan sistem desain [Gemini.md](file:///d:/data%20rayhan/programs/kanban-manegement/frontend/Gemini.md) dan aturan kualitas `.agents` tetap terjaga utuh.

---

## 2. Matriks Komparasi API Contract

| Endpoint | Kontrak Mock Lama | Kontrak Baru (Full Alignment Backend Hono) |
|---|---|---|
| **POST `/api/auth/login`** | `res.json(user)` (snake_case) | `{ success: true, message: "Login berhasil.", data: { user } }` (`divisionId`, `divisionName`, `isActive`) |
| **GET `/api/auth/me`** | `res.json(user)` | `{ success: true, message: "Profil berhasil diambil.", data: { user } }` |
| **POST `/api/auth/logout`** | `res.json({ success: true })` | `{ success: true, message: "Logout berhasil.", data: null }` |
| **GET `/api/tasks`** | `res.json(tasks)` (`due_date`, `assigned_to`, `?search=`) | `{ success: true, message: "...", data: { tasks: [...], total: N } }`<br>Query: `?q=&status=&priority=&assigneeId=`<br>Field: `dueDate`, `divisionId`, `createdBy`, `assignees: [...]` |
| **GET `/api/tasks/:id`** | `res.json(task)` | `{ success: true, message: "Detail task berhasil diambil.", data: { task } }` |
| **POST `/api/tasks`** | Body: `{ title, description, priority, assigned_to, due_date }` | Body: `{ title, description, priority, status, dueDate, assigneeIds: string[] }`<br>Response: `{ success: true, message: "...", data: { task } }` |
| **PATCH `/api/tasks/:id`** | Body: `{ title, description, status, priority, due_date }` | Body: `{ title, description, status, priority, dueDate, assigneeIds: string[] }`<br>Response: `{ success: true, message: "...", data: { task } }` |
| **DELETE `/api/tasks/:id`** | `res.json({ success: true })` | `{ success: true, message: "Task berhasil dihapus.", data: null }` |
| **GET `/api/members`** | `res.json(members)` (`division_id`, `status: "active"`) | `{ success: true, message: "...", data: { members: [...], total: N } }`<br>Field: `divisionId`, `isActive: boolean` |
| **POST `/api/members`** | Body: `{ name, email, role }` | Body: `{ name, email, password }` (role otomatis member per divisi admin)<br>Response: `{ success: true, message: "...", data: { member } }` |
| **PATCH `/api/members/:id`** | Body: `{ name, email, role }` | Body: `{ name?, email? }`<br>Response: `{ success: true, message: "...", data: { member } }` |
| **PATCH `/api/members/:id/status`** | Body: `{ status: "active" \| "inactive" }` | Body: `{ isActive: boolean }`<br>Response: `{ success: true, message: "...", data: { member } }` |

---

## 3. Desain Model & Tipe TypeScript Baru

### 3.1 Response Envelope (`src/types/api.ts`)
```typescript
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}
```

### 3.2 Auth & User (`src/types/auth.ts`)
```typescript
export type Role = "platform_admin" | "admin" | "member";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  divisionId: string | null;
  divisionName?: string | null;
  isActive: boolean;
  createdAt?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
```

### 3.3 Task & Assignee (`src/types/task.ts`)
```typescript
export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface TaskAssignee {
  id: string;
  name: string;
  email: string;
  role: string;
  assignedAt?: string;
}

export interface Task {
  id: string;
  divisionId: string;
  createdBy: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
  assignees: TaskAssignee[];
}

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  assigneeIds?: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  assigneeIds?: string[];
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  q?: string;
  assigneeId?: string;
}
```

### 3.4 Member (`src/types/member.ts`)
```typescript
import { Role } from "./auth";

export interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  divisionId: string;
  isActive: boolean;
  createdAt?: string;
}

export interface CreateMemberInput {
  name: string;
  email: string;
  password?: string;
}

export interface UpdateMemberInput {
  name?: string;
  email?: string;
}
```

---

## 4. Rincian Berkas yang Dimodifikasi

### 4.1 Tipe & Data Mock
| Berkas | Aksi | Deskripsi |
|---|---|---|
| `src/types/api.ts` | **Baru** | Definisi standar `ApiResponse<T>` dan `ApiErrorResponse`. |
| `src/types/auth.ts` | **Modifikasi** | Perbarui tipe `User` ke camelCase (`divisionId`, `isActive`). |
| `src/types/task.ts` | **Modifikasi** | Perbarui tipe `Task` ke camelCase, tambah `assignees: TaskAssignee[]`, filter `q`. |
| `src/types/member.ts` | **Modifikasi** | Perbarui tipe `Member` ke camelCase (`divisionId`, `isActive: boolean`). |
| `src/data/mock-db.json` | **Modifikasi** | Selaraskan seluruh isi database mock ke format camelCase & relasi `assignees`. |
| `src/lib/mock-session.ts` | **Modifikasi** | Sesuaikan pembacaan session dengan tipe user camelCase. |

### 4.2 Endpoint Mock API (`src/app/api/`)
| Berkas | Aksi | Deskripsi |
|---|---|---|
| `src/app/api/auth/login/route.ts` | **Modifikasi** | Return wrapper `{ success: true, message: "...", data: { user } }`. |
| `src/app/api/auth/me/route.ts` | **Modifikasi** | Return wrapper `{ success: true, message: "...", data: { user } }`. |
| `src/app/api/auth/logout/route.ts` | **Modifikasi** | Return wrapper `{ success: true, message: "...", data: null }`. |
| `src/app/api/tasks/route.ts` | **Modifikasi** | Filter parameter `q`, return wrapper `{ success: true, data: { tasks, total } }`. Handle `assigneeIds`. |
| `src/app/api/tasks/[id]/route.ts` | **Modifikasi** | GET, PATCH, DELETE dengan format wrapper resmi BE. |
| `src/app/api/members/route.ts` | **Modifikasi** | Return `{ success: true, data: { members, total } }`, POST menerima `password`. |
| `src/app/api/members/[id]/route.ts` | **Modifikasi** | PATCH nama/email dengan wrapper resmi BE. |
| `src/app/api/members/[id]/status/route.ts` | **Modifikasi** | PATCH `{ isActive: boolean }`. |

### 4.3 Service Layer & Zustand Stores
| Berkas | Aksi | Deskripsi |
|---|---|---|
| `src/services/auth-api.ts` | **Modifikasi** | Unpack `res.data.user`. |
| `src/services/task-api.ts` | **Modifikasi** | Unpack `res.data.tasks` dan `res.data.task`, ubah search param jadi `q`. |
| `src/services/member-api.ts` | **Modifikasi** | Unpack `res.data.members`, kirim payload `{ isActive: boolean }`. |
| `src/store/kanban-store.ts` | **Modifikasi** | Sesuaikan parameter `search` ke `q`, periksa filter `onlyMyTasks` via `t.assignees.some(a => a.id === user.id)`. |

### 4.4 Komponen UI
| Berkas | Aksi | Deskripsi |
|---|---|---|
| `src/components/kanban/task-card.tsx` | **Modifikasi** | Membaca `task.dueDate` dan avatar inisial dari `task.assignees[0]`. |
| `src/components/kanban/kanban-filter-bar.tsx` | **Modifikasi** | Kompatibel dengan filter store yang diperbarui. |
| `src/components/task/create-task-dialog.tsx` | **Modifikasi** | Form assign member mengirim `assigneeIds: [id]`, dueDate format YYYY-MM-DD. |
| `src/components/task/task-detail-dialog.tsx` | **Modifikasi** | Tampilan detail assignee list, dueDate, createdAt. |
| `src/components/members/member-table.tsx` | **Modifikasi** | Status badge membaca `member.isActive ? "Aktif" : "Nonaktif"`, tombol sakelar status mengirim boolean. |
| `src/components/members/add-member-dialog.tsx` | **Modifikasi** | Menambahkan field input default password sesuai schema backend. |
| `src/app/(protected)/dashboard/page.tsx` | **Modifikasi** | Penyesuaian `user.divisionId`, filter `onlyMyTasks`, hitungan badge. |
| `src/app/(protected)/members/page.tsx` | **Modifikasi** | Integrasi `member.isActive`, filter pencarian, dan toast actions. |

---

## 5. Kepatuhan Sistem Desain ([Gemini.md](file:///d:/data%20rayhan/programs/kanban-manegement/frontend/Gemini.md)) & `.agents`

- **Palet Warna:** Tidak ada perubahan warna, tetap terkunci pada Forest Olive (`#597928`), Sage Olive (`#91AC67`), Chestnut Brown (`#6E3511`), dan Warm Cream (`#FCECD8`).
- **Tipografi:** Tetap menggunakan font Oswald (`font-heading`) untuk judul/metrik dan Google Sans (`font-sans`) untuk teks isi/form.
- **Behind the Scenes:** Tanpa halaman khusus tema atau tombol tema di navbar/sidebar.
- **Aksesibilitas & Anti-Slop:** Input form memiliki label dan aria-labels yang lengkap, error state yang jelas, serta touch targets $\ge 40$px.

---

## 6. Tahapan Eksekusi

- [x] **Langkah 1:** Buat `src/types/api.ts` dan perbarui tipe di `src/types/auth.ts`, `src/types/task.ts`, serta `src/types/member.ts`.
- [x] **Langkah 2:** Perbarui data di `src/data/mock-db.json` dan helper session `src/lib/mock-session.ts` ke format camelCase & `assignees`.
- [x] **Langkah 3:** Perbarui seluruh Route Handler Next.js di `src/app/api/auth/...`, `src/app/api/tasks/...`, dan `src/app/api/members/...` agar mengembalikan envelope `{ success, message, data }`.
- [x] **Langkah 4:** Perbarui service layer di `src/services/` dan Zustand store di `src/store/`.
- [x] **Langkah 5:** Perbarui komponen UI (TaskCard, Create/Detail Dialog, MemberTable, AddMemberDialog, Dashboard, Members).
- [x] **Langkah 6:** Jalankan validasi pengujian: `npx tsc --noEmit`, `npm run lint`, dan `npm run build`.
- [x] **Langkah 7:** Commit dan push ke repository GitHub.
