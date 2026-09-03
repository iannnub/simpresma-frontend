import React from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { TelegramConnect } from '@/components/shared/TelegramConnect';
import {
  User,
  Mail,
  Phone,
  BookOpen,
  ShieldCheck,
  IdCard,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ROLE_LABEL: Record<string, { label: string; color: string }> = {
  mahasiswa:   { label: 'Mahasiswa',   color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' },
  verifikator: { label: 'Verifikator', color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300' },
  tendik:      { label: 'Tendik',      color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  wadek:       { label: 'Wadek',       color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300' },
  admin:       { label: 'Admin',       color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' },
};

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  const roles: string[] = (user as any).roles ?? [];

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Profil Saya</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Informasi akun dan pengaturan notifikasi Telegram.
        </p>
      </div>

      {/* Informasi Akun */}
      <Card className="border border-slate-200 dark:border-slate-700 shadow-soft-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
              <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Informasi Akun
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nama */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3 h-3" /> Nama Lengkap
              </p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {user.nama}
              </p>
            </div>

            {/* NIM/NIP */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <IdCard className="w-3 h-3" /> NIM / NIP
              </p>
              <p className="text-sm font-mono font-semibold text-slate-800 dark:text-slate-200">
                {(user as any).nim_nip ?? '-'}
              </p>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3 h-3" /> Email
              </p>
              <p className="text-sm text-slate-800 dark:text-slate-200">
                {user.email ?? '-'}
              </p>
            </div>

            {/* WhatsApp */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3 h-3" /> No. WhatsApp
              </p>
              <p className="text-sm text-slate-800 dark:text-slate-200">
                {(user as any).no_whatsapp ?? '-'}
              </p>
            </div>

            {/* Prodi */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3 h-3" /> Program Studi
              </p>
              <p className="text-sm text-slate-800 dark:text-slate-200">
                {user.prodi ? `${user.prodi.singkatan} — ${user.prodi.nama}` : '-'}
              </p>
            </div>

            {/* Roles */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3" /> Role Aktif
              </p>
              <div className="flex flex-wrap gap-1.5">
                {roles.length > 0 ? roles.map((r) => {
                  const info = ROLE_LABEL[r] ?? { label: r, color: 'bg-slate-100 text-slate-700' };
                  return (
                    <Badge key={r} className={`text-xs px-2 py-0.5 font-medium border-0 ${info.color}`}>
                      {info.label}
                    </Badge>
                  );
                }) : <span className="text-sm text-muted-foreground">-</span>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Telegram Connect */}
      <TelegramConnect />
    </div>
  );
}
