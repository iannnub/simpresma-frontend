import React from 'react';
import { HelpCircle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/useAuth';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentRole, getDefaultRouteForRole } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl border shadow-sm">
        <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto">
          <HelpCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">404</h1>
          <h2 className="text-xl font-semibold text-slate-800">Halaman Tidak Ditemukan</h2>
          <p className="text-sm text-muted-foreground">
            Alamat URL yang Anda tuju tidak tersedia atau telah dipindahkan.
          </p>
        </div>
        <div className="pt-2">
          <Button
            onClick={() => {
              if (isAuthenticated && currentRole) {
                navigate(getDefaultRouteForRole(currentRole), { replace: true });
              } else {
                navigate('/login', { replace: true });
              }
            }}
            className="flex items-center gap-1.5 mx-auto"
          >
            <Home className="w-4 h-4" /> Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
