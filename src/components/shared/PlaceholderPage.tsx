import React from 'react';
import { useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/hooks/useAuth';
import { CheckCircle2 } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  role: string;
  description?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  role,
  description = 'Halaman ini siap diimplementasikan pada fase berikutnya.',
}) => {
  const { currentRole, user } = useAuth();
  const params = useParams();

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {title}
              </CardTitle>
              <CardDescription className="mt-1 text-sm text-muted-foreground">
                {description}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center">
              <Badge variant="outline" className="capitalize text-xs font-semibold px-2.5 py-0.5">
                Peran: {role}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          {params.id && (
            <div className="p-3.5 bg-slate-100 rounded-lg text-sm flex items-center gap-2">
              <span className="font-semibold text-slate-700">Parameter ID:</span>
              <code className="bg-white px-2.5 py-0.5 rounded border border-slate-200 text-primary font-mono text-xs font-bold">
                {params.id}
              </code>
            </div>
          )}

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-sm flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Layout dan Navigasi Aktif</p>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Pengguna <strong>{user?.nama}</strong> aktif dengan peran{' '}
                <span className="font-bold uppercase tracking-wide">{currentRole}</span>. Navigasi desktop (Sidebar)
                dan navigasi mobile (Bottom Navigation & Slide-over Drawer) aktif dan responsif.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 pt-2">
            <div className="p-3 border rounded-lg bg-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Menu sidebar disaring dinamis sesuai peran</span>
            </div>
            <div className="p-3 border rounded-lg bg-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Multi-role switcher tersedia di header & sidebar</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceholderPage;
