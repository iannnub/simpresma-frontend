import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import authApi from '@/lib/api/auth.api';
import { useAuthStore } from '@/stores/authStore';
import { useRoleStore } from '@/stores/roleStore';
import ROUTES from '@/config/routes.config';
import type { UserRole } from '@/types';

export default function GapuraCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const { setCurrentRole, setAvailableRoles } = useRoleStore();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get('error') || searchParams.get('error_description');
    if (errorParam) {
      setErrorMessage(errorParam);
      toast.error(`Login GAPURA gagal: ${errorParam}`);
      return;
    }

    const token = searchParams.get('token');
    const roleParam = searchParams.get('role') as UserRole | null;
    const namaParam = searchParams.get('nama');

    if (!token) {
      setErrorMessage('Sesi otorisasi GAPURA tidak valid atau token tidak ditemukan.');
      return;
    }

    // Simpan token sementara di storage agar apiClient mengirimkan Bearer token
    localStorage.setItem('simpresma_token', token);

    // Ambil profil lengkap dari endpoint /api/auth/me
    authApi
      .me()
      .then((res) => {
        const user = res.data;
        login(user, token);

        const roles: UserRole[] = Array.isArray(user.roles) ? user.roles : ['mahasiswa'];

        const activeRole: UserRole = roleParam && roles.includes(roleParam) ? roleParam : roles[0] || 'mahasiswa';

        setAvailableRoles(roles);
        setCurrentRole(activeRole);

        toast.success(`Selamat datang, ${namaParam || user.nama}! Berhasil masuk via GAPURA UNEJ.`);

        // Arahkan ke dashboard sesuai peran
        switch (activeRole) {
          case 'admin':
            navigate(ROUTES.ADMIN.KELOLA_ROLE, { replace: true });
            break;
          case 'wadek':
            navigate(ROUTES.WADEK.DASHBOARD, { replace: true });
            break;
          case 'verifikator':
            navigate(ROUTES.VERIFIKATOR.DASHBOARD, { replace: true });
            break;
          case 'tendik':
            navigate(ROUTES.TENDIK.DASHBOARD, { replace: true });
            break;
          case 'mahasiswa':
          default:
            navigate(ROUTES.MAHASISWA.DASHBOARD, { replace: true });
            break;
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Gagal memverifikasi akun ke server SIMPRESMA.';
        setErrorMessage(msg);
        toast.error(msg);
      });
  }, [searchParams, login, navigate, setCurrentRole, setAvailableRoles]);

  if (errorMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Autentikasi GAPURA Gagal
            </h2>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {errorMessage}
            </p>
          </div>
          <Button asChild variant="outline" className="w-full gap-2 text-xs">
            <Link to={ROUTES.LOGIN}>
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Halaman Login
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-sm">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Menghubungkan ke GAPURA UNEJ
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Sedang memverifikasi sesi autentikasi dan memuat profil civitas akademika...
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-amber-700 dark:text-amber-400 font-medium pt-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Memproses data...</span>
        </div>
      </div>
    </div>
  );
}
