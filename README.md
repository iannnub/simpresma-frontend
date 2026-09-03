# SIMPRESMA Frontend

**Sistem Informasi Manajemen Prestasi Mahasiswa** — Frontend SPA berbasis React + TypeScript.

Aplikasi web ini melayani 4 role pengguna (Mahasiswa, Verifikator, Tendik, Wadek) untuk mengelola seluruh alur pengajuan konversi SKS dari prestasi perlombaan di lingkungan Fakultas Ilmu Komputer Universitas Jember.

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| **Framework** | React 18 + TypeScript 5 |
| **Build Tool** | Vite 5 |
| **Routing** | React Router v6 |
| **State Management** | Zustand (auth & role stores) |
| **Server State** | TanStack React Query v5 |
| **HTTP Client** | Axios |
| **UI Components** | Shadcn/UI + Radix UI |
| **Styling** | Tailwind CSS 3 |
| **Charts** | Recharts |
| **Form Validation** | Zod + React Hook Form |
| **Icons** | Lucide React |
| **Notifications** | Sonner (toast) |
| **Linting** | ESLint |
| **Formatting** | Prettier |

---

## Prasyarat

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **Backend API** running di `http://localhost:8000` (Laravel 11 + Sanctum)

---

## Instalasi

```bash
# Clone repository
git clone <repo-url>
cd simpresma-frontend

# Install dependencies
npm install

# Salin konfigurasi environment
cp .env.example .env.local
```

---

## Environment Variables

| Variable | Deskripsi | Default (Development) |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL backend API | `http://localhost:8000/api` |
| `VITE_APP_NAME` | Nama aplikasi | `SIMPRESMA` |

---

## Development

```bash
# Jalankan dev server (http://localhost:5173)
npm run dev

# Type-check tanpa build
npx tsc --noEmit

# Lint
npm run lint

# Format
npm run format
```

---

## Production Build

```bash
# Build untuk production
npm run build

# Preview production build secara lokal
npm run preview
```

Output build disimpan di folder `dist/`.

---

## Struktur Folder

```
src/
├── app/                  # Pages per role
│   ├── (auth)/           # Login page
│   ├── (mahasiswa)/      # Dashboard, pengajuan CRUD
│   ├── (verifikator)/    # Dashboard, verifikasi
│   ├── (tendik)/         # Dashboard, finalisasi
│   ├── (wadek)/          # Dashboard, matriks, verifikator, bidang-MK
│   └── (shared)/         # Direktori verifikator
├── components/
│   ├── charts/           # Recharts components (StatistikChart, StatusBreakdownChart)
│   ├── forms/            # Form dialogs (Pengajuan, Matriks, Verifikator, BidangMK, dll)
│   ├── layouts/          # AppLayout, ProtectedRoute, RoleRoute, Sidebar
│   ├── shared/           # Reusable UI (StatsCard, StatusBadge, EmptyState, dll)
│   └── ui/               # Shadcn/UI primitives
├── config/               # Route config, constants
├── lib/
│   ├── api/              # Axios API modules (mahasiswa, verifikator, tendik, wadek, ref, shared)
│   ├── hooks/            # React Query hooks
│   ├── schemas/          # Zod validation schemas
│   └── utils/            # Helpers (cn, logger)
├── stores/               # Zustand stores (auth, role)
├── types/                # TypeScript interfaces
├── App.tsx               # Root component (ErrorBoundary + QueryClient + Router + Toaster)
├── router.tsx            # React Router config dengan lazy loading
└── main.tsx              # Entry point
```

---

## Akun Demo (Development)

| Role | Email | Password |
|---|---|---|
| Wadek | `wadek@test.com` | `password` |
| Verifikator SI | `verif.si@test.com` | `password` |
| Tendik | `tendik@test.com` | `password` |
| Mahasiswa SI | `mhs.si@test.com` | `password` |
| Mahasiswa TI | `mhs.ti@test.com` | `password` |
| Mahasiswa IF | `mhs.if@test.com` | `password` |

---

## Fitur Utama

### Mahasiswa
- Dashboard statistik pribadi
- Form pengajuan multi-step (4 langkah: Info Lomba → Dokumen → Mata Kuliah → Preview)
- Riwayat pengajuan dengan detail status

### Verifikator
- Dashboard scope prodi dengan grafik distribusi
- Verifikasi pengajuan (Terima / Tolak dengan feedback)
- Snapshot matriks otomatis saat verifikasi

### Tendik
- Dashboard lintas prodi dengan analisis bar chart
- Finalisasi pengajuan: input huruf nilai strict (harus sesuai snapshot matriks)
- Input link SK dan nomor surat

### Wadek
- Dashboard eksekutif dengan pie + bar chart
- Kelola Matriks Konversi SKS (24 kombinasi tingkatan × tahapan)
- Kelola Tim Dosen Verifikator per prodi (Assign / Cabut)
- Pemetaan Bidang Lomba ↔ Mata Kuliah

### Shared
- Direktori Tim Dosen Verifikator (read-only, semua role)
- Statistik pengajuan fakultas

---

## Deployment

1. Set environment production:
   ```
   VITE_API_BASE_URL=https://api-simpresma.fik.unej.ac.id/api
   ```

2. Build:
   ```bash
   npm run build
   ```

3. Deploy folder `dist/` ke web server (Nginx, Apache, Vercel, Netlify, dll).

4. Konfigurasi web server untuk SPA (semua route redirect ke `index.html`).

---

## Lisensi

© 2026 Fakultas Ilmu Komputer — Universitas Jember. All rights reserved.
