# SIMPRESMA Frontend (SPA)

**Sistem Informasi Manajemen Prestasi Mahasiswa** — Antarmuka Web Single Page Application (SPA) modern berbasis React 18, TypeScript, dan Tailwind CSS untuk pengelolaan, verifikasi bertingkat, dan rekognisi konversi SKS prestasi perlombaan mahasiswa di lingkungan Fakultas Ilmu Komputer Universitas Jember.

Sistem terintegrasi penuh dengan **GAPURA UNEJ (Single Sign-On / OAuth 2.0 & OpenID Connect)** sebagai gerbang login resmi civitas akademika, serta mendukung otorisasi *Multi-Role Dinamis* untuk 5 peran pengguna.

---

## Daftar Isi
- [Gambaran Umum](#gambaran-umum)
- [Tech Stack](#tech-stack)
- [Arsitektur & Sistem Multi-Role](#arsitektur--sistem-multi-role)
- [Integrasi GAPURA UNEJ (SSO / OIDC)](#integrasi-gapura-unej-sso--oidc)
- [Struktur Direktori Proyek](#struktur-direktori-proyek)
- [Prasyarat & Konfigurasi Lingkungan](#prasyarat--konfigurasi-lingkungan)
- [Panduan Instalasi & Menjalankan](#panduan-instalasi--menjalankan)
- [Akun Demo Pengujian](#akun-demo-pengujian)
- [Fitur Utama Berdasarkan Peran](#fitur-utama-berdasarkan-peran)
- [Pengujian & Jaminan Mutu Kode (QA)](#pengujian--jaminan-mutu-kode-qa)
- [Panduan Build & Deployment](#panduan-build--deployment)

---

## Gambaran Umum

SIMPRESMA Frontend dirancang dengan fokus pada efisiensi tinggi, aksesibilitas (WCAG 2.1 AA), dan performa optimal. Aplikasi ini melayani seluruh proses bisnis pengajuan reward prestasi: mulai dari formulir pendaftaran 4-tahap oleh mahasiswa, verifikasi oleh dosen program studi, hingga finalisasi konversi nilai SKS dan penerbitan SK oleh staf akademik (Tendik).

UI dibangun dengan sistem desain berbasis *solid executive surfaces* (bebas gradasi artifisial), menghadirkan tipografi tajam, kontras warna terstandarisasi, serta dukungan penuh tema Gelap (*Dark Mode*) dan Terang (*Light Mode*).

---

## Tech Stack

| Layer | Teknologi | Versi | Keterangan |
|---|---|---|---|
| **Core Framework** | React | ^18.3.1 | Komponen berbasis deklaratif & fungsional hooks |
| **Language** | TypeScript | ^5.6.2 | Strict typing, zero implicit any, null safety |
| **Build Engine** | Vite | ^5.4.8 | Hot Module Replacement (HMR) instan & bundler rollup |
| **Routing** | React Router | ^6.26.2 | Declarative nested routing, role-guards, lazy code-splitting |
| **State Management** | Zustand | ^4.5.5 | Lightweight global stores (`authStore`, `roleStore`, `uiStore`) |
| **Server State / Cache** | TanStack React Query | ^5.56.2 | Smart caching, invalidation, deduplication, retry policy |
| **HTTP Client** | Axios | ^1.7.7 | Interceptor bearer token otomatis, error normalizer |
| **Design System** | Tailwind CSS & Shadcn/UI | ^3.4.11 | Radix UI primitives, token warna solid, zero gradients |
| **Data Visualization** | Recharts | ^2.12.7 | Responsive bar chart, pie breakdown, status metrics |
| **Form Validation** | React Hook Form & Zod | ^7.53 / ^3.23 | Validasi skema tipe-aman di sisi klien |
| **Notification Engine** | Sonner | ^1.5.0 | Toast notification eksekutif dengan undo/action support |
| **Unit Testing** | Vitest | ^2.1.1 | 23 automated tests (100% pass) |

---

## Arsitektur & Sistem Multi-Role

Sistem menerapkan otentikasi dan otorisasi berlapis menggunakan komponen penjaga rute (*Route Guards*):
1. **`ProtectedRoute`**: Memastikan pengguna telah terautentikasi dan memiliki token Bearer Sanctum yang valid.
2. **`RoleRoute`**: Membatasi akses modul spesifik hanya untuk peran (*role*) yang diizinkan.
3. **`RoleSwitcher`**: Memungkinkan pengguna dengan hak multi-peran (misalnya: Dosen Verifikator yang juga memiliki wewenang Tendik atau Wadek) untuk berpindah konteks kerja secara instan tanpa perlu logout.

### 5 Peran Pengguna:
- **Mahasiswa**: Pengajuan prestasi 4 langkah, pemilihan MK relevan, pelacakan linimasa status.
- **Verifikator**: Validasi pengajuan lingkup program studi (ACC / Tolak dengan catatan feedback wajib).
- **Tendik**: Finalisasi konversi nilai SKS, penginputan nomor SK, tautan berkas resmi, dan ekspor data Excel.
- **Wadek I**: Pengelolaan matriks konversi SKS (24 kombinasi), penugasan tim verifikator prodi, pemetaan bidang lomba ↔ mata kuliah kurikulum.
- **Super Admin**: Pengelolaan hak akses dinamis pengguna (`assignRole` / `revokeRole`) dan pemantauan riwayat audit trail.

---

## Integrasi GAPURA UNEJ (SSO / OIDC)

SIMPRESMA Frontend terhubung langsung ke pintu masuk tunggal **GAPURA UNEJ** (`https://gapura.unej.ac.id`):

### Alur Integrasi di Frontend:
1. **Tombol Masuk GAPURA**: Pengguna mengklik tombol *"Masuk dengan GAPURA UNEJ"* di halaman login.
2. **Panggilan Inisiasi Otorisasi**: Frontend menghubungi endpoint API backend `GET /api/auth/gapura/redirect?format=json` untuk memperoleh URL otorisasi resmi beserta token state anti-CSRF.
3. **Pengalihan ke Portal GAPURA**: Browser berpindah ke `https://gapura.unej.ac.id/oauth/authorize`.
4. **Verifikasi Kredensial Kampus**: Mahasiswa/Dosen/Tendik melakukan autentikasi menggunakan akun SISTER UNEJ (termasuk verifikasi 2FA atau Passkey).
5. **Callback Handshake (`/auth/callback`)**:
   - GAPURA mengarahkan kembali ke backend, lalu backend mengalihkan pengguna ke rute frontend [`src/app/(auth)/gapura-callback/page.tsx`](file:///d:/iann%20kuliah/project/simpresma/simpresma-frontend/src/app/(auth)/gapura-callback/page.tsx) dengan membawa token sesi.
   - Komponen callback menyimpan token, mengambil data profil lengkap via `/api/auth/me`, mengisi `authStore` dan `roleStore`, serta langsung mengarahkan pengguna ke dashboard perannya secara mulus.
6. **Graceful Fallback**: Jika integrasi GAPURA di kampus sedang dalam pemeliharaan atau kredensial Client ID belum dikonfigurasi, sistem menampilkan notifikasi toast edukatif dan form login lokal/demo tetap dapat digunakan 100%.

---

## Struktur Direktori Proyek

```
simpresma-frontend/
├── public/                 # Favicon dan aset statis
├── src/
│   ├── app/                # Halaman Aplikasi per Role
│   │   ├── (admin)/        # Modul Kelola Role & Audit Trail
│   │   ├── (auth)/         # Halaman Login & GAPURA Callback Handshake
│   │   │   ├── gapura-callback/
│   │   │   │   └── page.tsx
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── (mahasiswa)/    # Dashboard, Daftar Pengajuan, Form Pengajuan Baru, Detail
│   │   ├── (verifikator)/  # Dashboard Verifikasi, Antrean Pengajuan, Detail Review
│   │   ├── (tendik)/       # Dashboard Akademik, Daftar Pengajuan ACC, Finalisasi SK
│   │   ├── (wadek)/        # Dashboard Eksekutif, Matriks Konversi, Tim Verifikator, Bidang-MK
│   │   ├── (shared)/       # Direktori Publik Verifikator, Profil Pengguna
│   │   ├── ForbiddenPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── components/         # Komponen UI Reusable
│   │   ├── charts/         # StatistikChart, StatusBreakdownChart
│   │   ├── forms/          # PengajuanForm (Step 1-4), MatriksForm, VerifikatorForm, dll.
│   │   ├── layouts/        # AppLayout, Header, Sidebar, MobileNav, ProtectedRoute, RoleRoute
│   │   ├── shared/         # StatsCard, StatusBadge, EmptyState, ThemeToggle, RoleSwitcher
│   │   ├── tables/         # PengajuanTable dengan pagination, sorting, filter
│   │   └── ui/             # Shadcn / Radix primitives (Button, Card, Dialog, Select, dll.)
│   ├── config/             # Konfigurasi Rute (routes.config.ts) & Navigasi (navigation.config.ts)
│   ├── lib/
│   │   ├── api/            # Modul API Axios per domain (auth, mahasiswa, verifikator, dll.)
│   │   ├── hooks/          # React Query Custom Hooks
│   │   ├── schemas/        # Zod Validation Schemas
│   │   └── utils/          # Helpers (cn, logger, formatters)
│   ├── stores/             # Zustand Stores (authStore, roleStore, uiStore)
│   ├── styles/             # Tailwind CSS & Global CSS Tokens
│   ├── tests/              # Vitest Automated Unit Tests
│   ├── types/              # Deklarasi Interface TypeScript
│   ├── App.tsx             # Root Provider Wrapper
│   ├── main.tsx            # Application Entry Point
│   └── router.tsx          # Declarative BrowserRouter Configuration
├── .env.example            # Template Konfigurasi Environment
├── package.json            # Daftar Dependensi dan Skrip Proyek
├── tsconfig.json           # Konfigurasi Compiler TypeScript
└── vite.config.ts          # Konfigurasi Bundler Vite
```

---

## Prasyarat & Konfigurasi Lingkungan

### Prasyarat
- **Node.js** ≥ 18.x
- **npm** ≥ 9.x atau **pnpm** ≥ 8.x
- **SIMPRESMA Backend API** aktif berjalan di `http://localhost:8000`

### Konfigurasi `.env`
Salin template konfigurasi lingkungan:
```bash
cp .env.example .env.local
```

Isi variabel konfigurasi:
```env
# URL API Backend SIMPRESMA
VITE_API_BASE_URL="http://localhost:8000/api"

# Identitas Aplikasi
VITE_APP_NAME="SIMPRESMA"
```

---

## Panduan Instalasi & Menjalankan

```bash
# 1. Masuk ke direktori frontend
cd simpresma-frontend

# 2. Pasang dependensi
npm install

# 3. Jalankan server development
npm run dev -- --port 5173
```
Aplikasi web siap diakses melalui peramban di `http://localhost:5173`.

---

## Akun Demo Pengujian

Untuk mempermudah pengujian alur bisnis, halaman login menyediakan tombol pintas instan untuk akun-akun berikut:

| Peran (Role) | Email Pengujian | Password Default | Akses Modul |
|---|---|---|---|
| **Super Admin** | `admin@simpresma.unej.ac.id` | `admin123` | Kelola Role Pengguna & Audit Trail |
| **Mahasiswa SI** | `mhs.si@test.com` | `password` | Pengajuan Prestasi Mahasiswa |
| **Verifikator SI**| `verif.si@test.com` | `password` | Verifikasi Pengajuan Prodi SI |
| **Tendik** | `tendik@test.com` | `password` | Finalisasi Konversi Nilai & SK |
| **Wadek I** | `wadek@test.com` | `password` | Matriks Konversi, Dosen Verifikator, Bidang MK |
| **Multi-Role** | `multi@test.com` | `password` | Role Switcher (Verifikator + Tendik) |

---

## Fitur Utama Berdasarkan Peran

### 1. Mahasiswa
- **Dashboard Ringkasan**: Statistik capaian, total SKS diakui, persentase pengajuan disetujui.
- **Form Pengajuan Prestasi 4-Tahap**:
  - *Langkah 1*: Informasi Lomba (Nama, Tingkat, Kategori, Tahapan/Juara, Penyelenggara, Tanggal).
  - *Langkah 2*: Kelengkapan Dokumen (SK Tugas Mahasiswa, SK Dosen Pembimbing, Link Sertifikat, Poster, Medsos).
  - *Langkah 3*: Pemilihan Mata Kuliah Relevan (Berdasarkan bidang lomba & sisa kuota SKS matriks).
  - *Langkah 4*: Pratinjau (*Preview*) & Konfirmasi Pengiriman.
- **Pelacakan Pengajuan**: Linimasa status real-time, catatan perbaikan/feedback, dan unduh SK konversi.

### 2. Dosen Verifikator
- **Antrean Berdasarkan Prodi**: Pengajuan difilter otomatis sesuai program studi yang ditugaskan kepada verifikator.
- **Audit Berkas**: Pengecekan tautan sertifikat, SK tugas, dan validitas capaian lomba mahasiswa.
- **Keputusan**: Setujui (*ACC*) dengan catatan rekomendasi, atau Tolak dengan catatan feedback wajib.

### 3. Bagian Akademik / Tendik
- **Antrean Siap Finalisasi**: Hanya menampilkan pengajuan yang telah disetujui oleh dosen verifikator.
- **Validasi Nilai Strict**: Sistem mengunci batas huruf nilai sesuai snapshot matriks reward yang telah disetujui.
- **Penerbitan SK**: Input nomor surat, tanggal SK, tautan berkas SK resmi, dan catatan akademik.
- **Ekspor Data**: Mengunduh rekapitulasi pengajuan ke file Excel (`.xlsx`).

### 4. Wakil Dekan I (Akademik)
- **Dashboard Eksekutif**: Grafik tren capaian prestasi per prodi, breakdown kategori lomba, dan metrik SKS.
- **Kelola Matriks Reward**: Konfigurasi tabel 24 kombinasi (Tingkatan × Tahapan) untuk menentukan rentang SKS dan huruf nilai maksimal.
- **Penugasan Verifikator**: Menunjuk dosen aktif sebagai verifikator prodi atau mencabut penugasan.
- **Pemetaan Bidang-MK**: Memetakan bidang kompetisi lomba terhadap mata kuliah kurikulum yang dapat dikonversi.

### 5. Administrator
- **Manajemen Role**: Menetapkan atau mencabut role pengguna secara dinamis.
- **Audit Trail**: Mencatat waktu modifikasi, role yang diubah, dan identitas administrator pengubah.

---

## Pengujian & Jaminan Mutu Kode (QA)

SIMPRESMA Frontend menerapkan standar kualitas kode yang ketat:

```bash
# 1. Menjalankan pemeriksaan tipe data (TypeScript)
npm run type-check

# 2. Menjalankan linter kode (ESLint)
npm run lint

# 3. Menjalankan unit tests otomatis (Vitest)
npm run test
```

### Hasil Pengujian Unit:
```text
 ✓ src/tests/navigation.test.ts (4 tests)
 ✓ src/tests/cn.test.ts (3 tests)
 ✓ src/tests/pengajuan.schema.test.ts (10 tests)
 ✓ src/tests/formatters.test.ts (2 tests)
 ✓ src/tests/gapura.test.ts (4 tests)

 Test Files  5 passed (5)
      Tests  23 passed (23)
```

---

## Panduan Build & Deployment

### Build Produksi
```bash
npm run build
```
Hasil kompilasi dan optimasi aset statis akan disimpan di folder `dist/`.

### Konfigurasi Web Server (SPA Fallback)
Karena aplikasi menggunakan *client-side routing* (React Router), seluruh permintaan rute harus dialihkan ke `index.html`.

#### Nginx Configuration:
```nginx
server {
    listen 80;
    server_name simpresma.unej.ac.id;
    root /var/www/simpresma-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
```

---

## Lisensi

© 2026 Fakultas Ilmu Komputer — Universitas Jember. Seluruh hak cipta dilindungi undang-undang.
