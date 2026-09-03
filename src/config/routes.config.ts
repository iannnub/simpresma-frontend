export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  FORBIDDEN: '/403',

  // Shared
  DIREKTORI_VERIFIKATOR: '/direktori-verifikator',
  PROFILE: '/profil',

  // Mahasiswa
  MAHASISWA: {
    DASHBOARD: '/mahasiswa/dashboard',
    PENGAJUAN_LIST: '/mahasiswa/pengajuan',
    PENGAJUAN_NEW: '/mahasiswa/pengajuan/new',
    PENGAJUAN_DETAIL: (id: string | number) => `/mahasiswa/pengajuan/${id}`,
  },

  // Verifikator
  VERIFIKATOR: {
    DASHBOARD: '/verifikator/dashboard',
    PENGAJUAN_LIST: '/verifikator/pengajuan',
    PENGAJUAN_DETAIL: (id: string | number) => `/verifikator/pengajuan/${id}`,
  },

  // Tendik
  TENDIK: {
    DASHBOARD: '/tendik/dashboard',
    PENGAJUAN_LIST: '/tendik/pengajuan',
    PENGAJUAN_DETAIL: (id: string | number) => `/tendik/pengajuan/${id}`,
  },

  // Wadek
  WADEK: {
    DASHBOARD: '/wadek/dashboard',
    MATRIKS: '/wadek/matriks',
    VERIFIKATOR: '/wadek/verifikator',
    BIDANG_MK: '/wadek/bidang-mk',
  },

  // Admin
  ADMIN: {
    KELOLA_ROLE: '/admin/kelola-role',
  },
} as const;

export default ROUTES;
