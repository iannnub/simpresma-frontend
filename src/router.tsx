import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layout guards & wrapper
import ProtectedRoute from '@/components/layouts/ProtectedRoute';
import RoleRoute from '@/components/layouts/RoleRoute';
import AppLayout from '@/components/layouts/AppLayout';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

// Auth Pages (keep eager — critical path)
import LoginPage from '@/app/(auth)/login/page';
import ForbiddenPage from '@/app/ForbiddenPage';
import NotFoundPage from '@/app/NotFoundPage';

// Lazy-loaded Pages — code-split heavy modules
const MahasiswaDashboardPage = lazy(() => import('@/app/(mahasiswa)/dashboard/page'));
const MahasiswaPengajuanListPage = lazy(() => import('@/app/(mahasiswa)/pengajuan/page'));
const MahasiswaNewPengajuanPage = lazy(() => import('@/app/(mahasiswa)/pengajuan/new/page'));
const MahasiswaDetailPengajuanPage = lazy(() => import('@/app/(mahasiswa)/pengajuan/[id]/page'));

const VerifikatorDashboardPage = lazy(() => import('@/app/(verifikator)/dashboard/page'));
const VerifikatorPengajuanListPage = lazy(() => import('@/app/(verifikator)/pengajuan/page'));
const VerifikatorDetailPengajuanPage = lazy(() => import('@/app/(verifikator)/pengajuan/[id]/page'));

const TendikDashboardPage = lazy(() => import('@/app/(tendik)/dashboard/page'));
const TendikPengajuanListPage = lazy(() => import('@/app/(tendik)/pengajuan/page'));
const TendikDetailPengajuanPage = lazy(() => import('@/app/(tendik)/pengajuan/[id]/page'));

const WadekDashboardPage = lazy(() => import('@/app/(wadek)/dashboard/page'));
const WadekMatriksPage = lazy(() => import('@/app/(wadek)/matriks/page'));
const WadekVerifikatorPage = lazy(() => import('@/app/(wadek)/verifikator/page'));
const WadekBidangMkPage = lazy(() => import('@/app/(wadek)/bidang-mk/page'));

const DirektoriVerifikatorPage = lazy(() => import('@/app/(shared)/direktori-verifikator/page'));
const ProfilePage = lazy(() => import('@/app/(shared)/profile/page'));

const AdminKelolaRolePage = lazy(() => import('@/app/(admin)/kelola-role/page'));

import { useAuthStore } from '@/stores/authStore';
import { useRoleStore } from '@/stores/roleStore';
import ROUTES from '@/config/routes.config';

// Suspense fallback wrapper
const SuspenseFallback = () => <LoadingSpinner variant="page" text="Memuat halaman..." />;

const LazyPage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<SuspenseFallback />}>{children}</Suspense>
);

// Root redirect handler based on current auth & role state
const RootRedirect: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { currentRole } = useRoleStore();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  switch (currentRole) {
    case 'mahasiswa':
      return <Navigate to={ROUTES.MAHASISWA.DASHBOARD} replace />;
    case 'verifikator':
      return <Navigate to={ROUTES.VERIFIKATOR.DASHBOARD} replace />;
    case 'tendik':
      return <Navigate to={ROUTES.TENDIK.DASHBOARD} replace />;
    case 'wadek':
      return <Navigate to={ROUTES.WADEK.DASHBOARD} replace />;
    case 'admin':
      return <Navigate to={ROUTES.ADMIN.KELOLA_ROLE} replace />;
    default:
      return <Navigate to={ROUTES.LOGIN} replace />;
  }
};

export const router = createBrowserRouter([
  // Root Redirect
  {
    path: ROUTES.HOME,
    element: <RootRedirect />,
  },

  // Public Route
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },

  // Protected Routes Wrapper
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          // Shared Routes (accessible to all authenticated users)
          {
            path: ROUTES.DIREKTORI_VERIFIKATOR,
            element: <LazyPage><DirektoriVerifikatorPage /></LazyPage>,
          },
          {
            path: ROUTES.PROFILE,
            element: <LazyPage><ProfilePage /></LazyPage>,
          },

          // Mahasiswa Routes
          {
            element: <RoleRoute allowedRoles={['mahasiswa']} />,
            children: [
              {
                path: ROUTES.MAHASISWA.DASHBOARD,
                element: <LazyPage><MahasiswaDashboardPage /></LazyPage>,
              },
              {
                path: ROUTES.MAHASISWA.PENGAJUAN_LIST,
                element: <LazyPage><MahasiswaPengajuanListPage /></LazyPage>,
              },
              {
                path: ROUTES.MAHASISWA.PENGAJUAN_NEW,
                element: <LazyPage><MahasiswaNewPengajuanPage /></LazyPage>,
              },
              {
                path: '/mahasiswa/pengajuan/:id',
                element: <LazyPage><MahasiswaDetailPengajuanPage /></LazyPage>,
              },
            ],
          },

          // Verifikator Routes
          {
            element: <RoleRoute allowedRoles={['verifikator']} />,
            children: [
              {
                path: ROUTES.VERIFIKATOR.DASHBOARD,
                element: <LazyPage><VerifikatorDashboardPage /></LazyPage>,
              },
              {
                path: ROUTES.VERIFIKATOR.PENGAJUAN_LIST,
                element: <LazyPage><VerifikatorPengajuanListPage /></LazyPage>,
              },
              {
                path: '/verifikator/pengajuan/:id',
                element: <LazyPage><VerifikatorDetailPengajuanPage /></LazyPage>,
              },
            ],
          },

          // Tendik Routes
          {
            element: <RoleRoute allowedRoles={['tendik']} />,
            children: [
              {
                path: ROUTES.TENDIK.DASHBOARD,
                element: <LazyPage><TendikDashboardPage /></LazyPage>,
              },
              {
                path: ROUTES.TENDIK.PENGAJUAN_LIST,
                element: <LazyPage><TendikPengajuanListPage /></LazyPage>,
              },
              {
                path: '/tendik/pengajuan/:id',
                element: <LazyPage><TendikDetailPengajuanPage /></LazyPage>,
              },
            ],
          },

          // Wadek Routes
          {
            element: <RoleRoute allowedRoles={['wadek']} />,
            children: [
              {
                path: ROUTES.WADEK.DASHBOARD,
                element: <LazyPage><WadekDashboardPage /></LazyPage>,
              },
              {
                path: ROUTES.WADEK.MATRIKS,
                element: <LazyPage><WadekMatriksPage /></LazyPage>,
              },
              {
                path: ROUTES.WADEK.VERIFIKATOR,
                element: <LazyPage><WadekVerifikatorPage /></LazyPage>,
              },
              {
                path: ROUTES.WADEK.BIDANG_MK,
                element: <LazyPage><WadekBidangMkPage /></LazyPage>,
              },
            ],
          },

          // Admin Routes
          {
            element: <RoleRoute allowedRoles={['admin']} />,
            children: [
              {
                path: ROUTES.ADMIN.KELOLA_ROLE,
                element: <LazyPage><AdminKelolaRolePage /></LazyPage>,
              },
            ],
          },
        ],
      },
    ],
  },

  // Error Pages
  {
    path: ROUTES.FORBIDDEN,
    element: <ForbiddenPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
], {
  future: {
    v7_relativeSplatPath: true,
  },
});

export default router;
