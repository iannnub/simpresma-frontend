import React, { useState } from 'react';
import {
  Users,
  Building2,
  Mail,
  Phone,
  Search,
  ExternalLink,
  ShieldCheck,
  Award,
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDirektoriVerifikator } from '@/lib/hooks/useDashboard';
import { useAuth } from '@/lib/hooks/useAuth';

export default function DirektoriVerifikatorPage() {
  const { user, currentRole } = useAuth();
  const { data: prodiGroups = [], isLoading } = useDirektoriVerifikator();
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Jika mahasiswa, hanya tampilkan dosen verifikator prodinya sendiri
  const studentProdiId = user?.prodi?.id;
  const visibleGroups =
    currentRole === 'mahasiswa' && studentProdiId
      ? prodiGroups.filter((g) => g.prodi_id === studentProdiId)
      : prodiGroups;

  const totalDosen = visibleGroups.reduce((acc, g) => acc + (g.jumlah || 0), 0);

  const filteredGroups = visibleGroups.map((group) => {
    if (!searchQuery.trim()) return group;
    const query = searchQuery.toLowerCase();
    const filteredVerifikators = group.verifikators.filter(
      (v) =>
        v.nama.toLowerCase().includes(query) ||
        v.nim_nip?.toLowerCase().includes(query) ||
        v.email?.toLowerCase().includes(query)
    );
    return {
      ...group,
      verifikators: filteredVerifikators,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-white inline-flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-200" />
            Direktori Resmi Fakultas
          </span>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Direktori Tim Dosen Verifikator
          </h2>
          <p className="text-sm text-blue-100 max-w-xl">
            {currentRole === 'mahasiswa'
              ? `Daftar dosen verifikator resmi untuk Program Studi ${user?.prodi?.nama || 'Anda'} yang bertugas memvalidasi pengajuan konversi prestasi.`
              : 'Daftar dosen verifikator resmi yang ditugaskan Dekanat untuk memvalidasi dan menilai prestasi mahasiswa di setiap program studi.'}
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-3 rounded-xl text-center self-start sm:self-center shrink-0">
          <div className="text-2xl font-black">{totalDosen}</div>
          <div className="text-[11px] text-blue-200">Dosen Verifikator Aktif</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari berdasarkan nama dosen atau NIP..."
          className="pl-9 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Memuat direktori verifikator...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredGroups.map((group) => (
            <Card key={group.prodi_id} className="overflow-hidden">
              <CardHeader className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 py-3.5 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {group.nama_prodi} ({group.prodi})
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {group.verifikators.length} dosen verifikator terdaftar
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs bg-white dark:bg-slate-900 font-mono dark:border-slate-800">
                  Prodi #{group.prodi_id}
                </Badge>
              </CardHeader>

              <CardContent className="p-4">
                {group.verifikators.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6">
                    {searchQuery
                      ? 'Tidak ada dosen yang cocok dengan pencarian di prodi ini.'
                      : 'Belum ada dosen verifikator yang ditugaskan untuk program studi ini.'}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.verifikators.map((dosen) => (
                      <div
                        key={dosen.id}
                        className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 shadow-soft-sm hover:shadow-soft-md transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 leading-snug">
                              {dosen.nama}
                            </h4>
                            <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
                              {dosen.nim_nip || 'NIP Belum Diisi'}
                            </p>
                          </div>
                          <Badge className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 text-[10px] shrink-0">
                            Aktif
                          </Badge>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                          {dosen.email && (
                            <a
                              href={`mailto:${dosen.email}`}
                              className="flex items-center gap-1.5 hover:text-primary transition-colors text-[11px] truncate"
                            >
                              <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                              <span className="truncate">{dosen.email}</span>
                            </a>
                          )}
                          {dosen.no_whatsapp ? (
                            <a
                              href={`https://wa.me/${dosen.no_whatsapp.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-mono font-medium hover:underline text-[11px]"
                            >
                              <Phone className="w-3.5 h-3.5 shrink-0" />
                              <span>{dosen.no_whatsapp}</span>
                              <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                            </a>
                          ) : (
                            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                              <Phone className="w-3.5 h-3.5 shrink-0" />
                              <span>WhatsApp Belum Tersedia</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
