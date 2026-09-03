import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Calendar, Award, BookOpen, AlertCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/shared/StatusBadge';
import type { Pengajuan } from '@/types';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

interface PengajuanTableProps {
  data: Pengajuan[];
  detailPathPrefix?: string;
  isLoading?: boolean;
}

export const PengajuanTable: React.FC<PengajuanTableProps> = ({
  data,
  detailPathPrefix = '/mahasiswa/pengajuan',
  isLoading = false,
}) => {
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd MMM yyyy', { locale: localeId });
    } catch {
      return dateStr;
    }
  };

  const calculateTotalSks = (item: Pengajuan) => {
    if (item.mata_kuliahs && item.mata_kuliahs.length > 0) {
      return item.mata_kuliahs.reduce((acc, mk) => acc + (mk.sks || 0), 0);
    }
    return '-';
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <p className="mt-2 text-sm text-muted-foreground">Memuat data pengajuan...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Belum Ada Pengajuan</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
          Anda belum memiliki riwayat pengajuan prestasi lomba untuk konversi SKS.
        </p>
        <Button asChild size="sm">
          <Link to="/mahasiswa/pengajuan/new">Ajukan Prestasi Baru</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View (≥768px) */}
      <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-soft-sm transition-colors duration-200">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
            <TableRow className="border-b border-slate-200 dark:border-slate-800 hover:bg-transparent">
              <TableHead className="w-[80px] text-slate-600 dark:text-slate-400">ID</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Nama Lomba & Bidang</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Tingkat & Capaian</TableHead>
              <TableHead className="text-center text-slate-600 dark:text-slate-400">SKS Konversi</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-400">Tanggal</TableHead>
              <TableHead className="text-center text-slate-600 dark:text-slate-400">Status</TableHead>
              <TableHead className="text-right text-slate-600 dark:text-slate-400">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow
                key={item.id}
                className="border-b border-slate-100 dark:border-slate-800/70 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
              >
                <TableCell className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                  #{item.id}
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                    {item.nama_lomba}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {item.bidang?.nama || 'Bidang Lomba'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    {item.tingkatan?.nama || '-'}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {item.tahapan?.nama || '-'} {item.detail_juara ? `(${item.detail_juara})` : ''}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300">
                    <BookOpen className="w-3 h-3 text-primary" />
                    {calculateTotalSks(item)} SKS
                  </span>
                </TableCell>
                <TableCell className="text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  {formatDate(item.created_at)}
                </TableCell>
                <TableCell className="text-center">
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-8 px-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    <Link to={`${detailPathPrefix}/${item.id}`}>
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      Detail
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card List View (<768px) */}
      <div className="md:hidden space-y-3">
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft-sm space-y-3 transition-colors duration-200"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-semibold">
                  #{item.id}
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                  {item.nama_lomba}
                </h4>
                <p className="text-xs text-muted-foreground">{item.bidang?.nama}</p>
              </div>
              <StatusBadge status={item.status} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">{item.tingkatan?.nama}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{calculateTotalSks(item)} SKS</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2 text-muted-foreground text-[11px]">
                <Calendar className="w-3 h-3 shrink-0" />
                <span>Diajukan {formatDate(item.created_at)}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full text-xs h-8 dark:border-slate-800 dark:hover:bg-slate-800"
              >
                <Link to={`${detailPathPrefix}/${item.id}`}>
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  Lihat Rincian Pengajuan
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PengajuanTable;
