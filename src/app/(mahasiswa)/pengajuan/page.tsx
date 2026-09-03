import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PengajuanTable from '@/components/tables/PengajuanTable';
import { usePengajuanList } from '@/lib/hooks/usePengajuan';

export default function MahasiswaPengajuanListPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data, isLoading } = usePengajuanList({
    page,
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  const items = data?.items || [];
  const meta = data?.meta;

  // Filter items locally as well if backend returns full list
  const filteredItems =
    statusFilter === 'all'
      ? items
      : items.filter((item) => item.status.toLowerCase() === statusFilter.toLowerCase());

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Daftar Pengajuan Prestasi
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Pantau status verifikasi dan hasil konversi nilai seluruh prestasi perlombaan Anda.
          </p>
        </div>
        <div>
          <Button asChild className="gap-2 shadow-sm">
            <Link to="/mahasiswa/pengajuan/new">
              <PlusCircle className="w-4 h-4" />
              Ajukan Prestasi Baru
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter & Table Card */}
      <Card>
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Riwayat Pengajuan
            </CardTitle>
            <CardDescription className="text-xs">
              Menampilkan {filteredItems.length} dari {meta?.total || filteredItems.length} data
            </CardDescription>
          </div>

          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Filter Status:</span>
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[150px] h-8 text-xs dark:bg-slate-900 dark:border-slate-800">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-900 dark:border-slate-800">
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="diterima">Diterima</SelectItem>
                <SelectItem value="ditolak">Ditolak</SelectItem>
                <SelectItem value="selesai">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          <PengajuanTable
            data={filteredItems}
            isLoading={isLoading}
            detailPathPrefix="/mahasiswa/pengajuan"
          />

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
        </CardContent>
      </Card>
    </div>
  );
}
