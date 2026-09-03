import React from 'react';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Users,
  ClipboardCheck,
  FileCheck2,
  SlidersHorizontal,
  UserCheck,
  GitBranch,
  ShieldCheck,
} from 'lucide-react';
import type { UserRole } from '@/types';
import ROUTES from './routes.config';

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number | null;
  exact?: boolean;
}

export const NAVIGATION_CONFIG: Record<UserRole, NavItem[]> = {
  mahasiswa: [
    {
      title: 'Dashboard',
      href: ROUTES.MAHASISWA.DASHBOARD,
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: 'Pengajuan Saya',
      href: ROUTES.MAHASISWA.PENGAJUAN_LIST,
      icon: FileText,
    },
    {
      title: 'Ajukan Prestasi',
      href: ROUTES.MAHASISWA.PENGAJUAN_NEW,
      icon: PlusCircle,
      exact: true,
    },
    {
      title: 'Direktori Verifikator',
      href: ROUTES.DIREKTORI_VERIFIKATOR,
      icon: Users,
    },
  ],

  verifikator: [
    {
      title: 'Dashboard',
      href: ROUTES.VERIFIKATOR.DASHBOARD,
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: 'Verifikasi Pengajuan',
      href: ROUTES.VERIFIKATOR.PENGAJUAN_LIST,
      icon: ClipboardCheck,
    },
    {
      title: 'Direktori Verifikator',
      href: ROUTES.DIREKTORI_VERIFIKATOR,
      icon: Users,
    },
  ],

  tendik: [
    {
      title: 'Dashboard',
      href: ROUTES.TENDIK.DASHBOARD,
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: 'Finalisasi Nilai & SK',
      href: ROUTES.TENDIK.PENGAJUAN_LIST,
      icon: FileCheck2,
    },
    {
      title: 'Direktori Verifikator',
      href: ROUTES.DIREKTORI_VERIFIKATOR,
      icon: Users,
    },
  ],

  wadek: [
    {
      title: 'Dashboard',
      href: ROUTES.WADEK.DASHBOARD,
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: 'Matriks Konversi',
      href: ROUTES.WADEK.MATRIKS,
      icon: SlidersHorizontal,
    },
    {
      title: 'Dosen Verifikator',
      href: ROUTES.WADEK.VERIFIKATOR,
      icon: UserCheck,
    },
    {
      title: 'Pemetaan Bidang MK',
      href: ROUTES.WADEK.BIDANG_MK,
      icon: GitBranch,
    },
    {
      title: 'Direktori Verifikator',
      href: ROUTES.DIREKTORI_VERIFIKATOR,
      icon: Users,
    },
  ],

  admin: [
    {
      title: 'Kelola Role User',
      href: ROUTES.ADMIN.KELOLA_ROLE,
      icon: ShieldCheck,
      exact: true,
    },
    {
      title: 'Direktori Verifikator',
      href: ROUTES.DIREKTORI_VERIFIKATOR,
      icon: Users,
    },
  ],

  dosen: [
    {
      title: 'Direktori Verifikator',
      href: ROUTES.DIREKTORI_VERIFIKATOR,
      icon: Users,
    },
  ],
};

export default NAVIGATION_CONFIG;
