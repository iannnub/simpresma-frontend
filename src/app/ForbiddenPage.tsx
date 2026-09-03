import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/useAuth';

export const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentRole, getDefaultRouteForRole } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl border shadow-sm">
        <div className="w-16 h-16 bg-red-50 text-destructive rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">403 — Akses Ditolak</h1>
          <p className="text-sm text-muted-foreground">
            Anda tidak memiliki hak akses untuk membuka halaman ini dengan peran ({currentRole || 'Guest'}).
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Button>
          <Button
            onClick={() => {
              if (currentRole) {
                navigate(getDefaultRouteForRole(currentRole), { replace: true });
              } else {
                navigate('/login', { replace: true });
              }
            }}
          >
            Ke Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage;
