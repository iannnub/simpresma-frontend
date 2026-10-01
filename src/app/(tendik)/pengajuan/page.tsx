import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  Calendar,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  User,
  Building2,
  Clock,
  Eye,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import StatusBadge from '@/components/shared/StatusBadge';
import { useTendikPengajuanList } from '@/lib/hooks/usePengajuan';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export default function TendikPengajuanListPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'diterima' | 'riwayat' | 'all'>('diterima');
  const { data, isLoading } = useTendikPengajuanList({ page, status: statusFilter });

  const items = data?.items || [];
  const meta = data?.meta;
  const counts = (data as any)?.counts;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      return format(new Date(dateStr), 'dd MMM yyyy', { locale: localeId });
    } catch {
      return dateStr;
    }
  };

  const calculateTotalSks = (mkList?: any[]) => {
    if (mkList && mkList.length > 0) {
      return mkList.reduce((acc, mk) => acc + (mk.sks || 0), 0);
    }
    return '-';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Finalisasi Konversi Nilai & SK
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Kelola antrean pengajuan yang disetujui verifikator untuk penerbitan SK atau pantau riwayat pengajuan yang telah selesai.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => {
            setStatusFilter('diterima');
            setPage(1);
          }}
          className={`shrink-0 whitespace-nowrap flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            statusFilter === 'diterima'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Siap Finalisasi SK
          {counts?.diterima !== undefined && (
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              statusFilter === 'diterima' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
            }`}>
              {counts.diterima}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setStatusFilter('riwayat');
            setPage(1);
          }}
          className={`shrink-0 whitespace-nowrap flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            statusFilter === 'riwayat'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Riwayat Telah Selesai
          {counts?.riwayat !== undefined && (
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              statusFilter === 'riwayat' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}>
              {counts.riwayat}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setStatusFilter('all');
            setPage(1);
          }}
          className={`shrink-0 whitespace-nowrap flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            statusFilter === 'all'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Semua Pengajuan
        </button>
      </div>

      <Card>
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {statusFilter === 'diterima'
                ? 'Antrean Pengajuan Siap Finalisasi'
                : statusFilter === 'riwayat'
                ? 'Riwayat Pengajuan Selesai'
                : 'Seluruh Pengajuan Mahasiswa'}
            </CardTitle>
            <CardDescription className="text-xs">
              Menampilkan {items.length} dari {meta?.total || items.length} data pengajuan
            </CardDescription>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/50 font-medium">
            <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Lintas Semua Prodi</span>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {isLoading ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
              <p className="mt-2 text-sm text-muted-foreground">Memuat data pengajuan...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 px-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {statusFilter === 'diterima'
                  ? 'Semua Pengajuan Telah Difinalisasi'
                  : statusFilter === 'riwayat'
                  ? 'Belum Ada Riwayat Selesai'
                  : 'Belum Ada Pengajuan'}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
                {statusFilter === 'diterima'
                  ? 'Tidak ada pengajuan berstatus Diterima yang belum diterbitkan SK konversinya saat ini.'
                  : statusFilter === 'riwayat'
                  ? 'Pengajuan yang telah difinalisasi nilainya dan diterbitkan SK akan tampil di sini.'
                  : 'Belum ada data pengajuan dalam sistem.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Desktop Table View (≥768px) */}
              <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-soft-sm transition-colors duration-200">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs">
                    <TableRow className="border-b border-slate-200 dark:border-slate-800 hover:bg-transparent">
                      <TableHead className="w-[70px] text-slate-600 dark:text-slate-400">ID</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400">Mahasiswa</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400">Program Studi</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400">Nama Lomba & Tingkat</TableHead>
                      <TableHead className="text-center text-slate-600 dark:text-slate-400">SKS</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400">Status</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400">Tanggal</TableHead>
                      <TableHead className="text-right text-slate-600 dark:text-slate-400">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow
                        key={item.id}
                        className="border-b border-slate-100 dark:border-slate-800/70 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <TableCell className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                          #{item.id}
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-primary shrink-0" />
                            {item.mahasiswa?.nama || item.user?.nama || 'Mahasiswa'}
                          </div>
                          <div className="font-mono text-[11px] text-muted-foreground pl-5">
                            NIM: {item.mahasiswa?.nim_nip || item.user?.nim_nip || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-xs px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700">
                            {item.prodi?.singkatan}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs leading-tight">
                            {item.nama_lomba}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {item.tingkatan?.nama} - {item.tahapan?.nama}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300">
                            <BookOpen className="w-3 h-3 text-emerald-600" />
                            {calculateTotalSks(item.mata_kuliahs)} SKS
                          </span>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={item.status} />
                        </TableCell>
                        <TableCell className="text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {formatDate(item.verified_at || item.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.status === 'diterima' ? (
                            <Button
                              variant="default"
                              size="sm"
                              asChild
                              className="h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 gap-1.5 shadow-sm text-white"
                            >
                              <Link to={`/tendik/pengajuan/${item.id}`}>
                                <FileCheck2 className="w-3.5 h-3.5" />
                                Proses SK
                              </Link>
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="h-8 px-3 text-xs border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 gap-1.5"
                            >
                              <Link to={`/tendik/pengajuan/${item.id}`}>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Detail (Selesai)
                              </Link>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card List View (<768px) */}
              <div className="md:hidden space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft-sm space-y-3 text-xs transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-semibold">
                            #{item.id}
                          </span>
                          <span className="font-bold text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300">
                            {item.prodi?.singkatan}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                          {item.mahasiswa?.nama || item.user?.nama}
                        </h4>
                        <p className="font-mono text-[11px] text-muted-foreground">
                          NIM: {item.mahasiswa?.nim_nip || item.user?.nim_nip}
                        </p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>

                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-1">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{item.nama_lomba}</p>
                      <p className="text-muted-foreground text-[11px]">{item.tingkatan?.nama}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 py-1 text-slate-600 dark:text-slate-400 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate">{item.tahapan?.nama}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{calculateTotalSks(item.mata_kuliahs)} SKS</span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2 text-muted-foreground text-[10px]">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <span>Disetujui {formatDate(item.verified_at || item.created_at)}</span>
                      </div>
                    </div>

                    <Button
                      variant={item.status === 'diterima' ? 'default' : 'outline'}
                      size="sm"
                      asChild
                      className={`w-full text-xs h-8 gap-1.5 ${
                        item.status === 'diterima'
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/50'
                      }`}
                    >
                      <Link to={`/tendik/pengajuan/${item.id}`}>
                        {item.status === 'diterima' ? (
                          <>
                            <FileCheck2 className="w-3.5 h-3.5" />
                            Finalisasi Nilai Konversi
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Buka Detail
                          </>
                        )}
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {meta && meta.last_page > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-muted-foreground">
                    Halaman {meta.current_page} dari {meta.last_page}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      className="h-8 px-2.5 text-xs gap-1 dark:border-slate-800 dark:hover:bg-slate-800"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Sebelumnya
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= meta.last_page}
                      onClick={() => setPage((p) => Math.min(p + 1, meta.last_page))}
                      className="h-8 px-2.5 text-xs gap-1 dark:border-slate-800 dark:hover:bg-slate-800"
                    >
                      Berikutnya <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
