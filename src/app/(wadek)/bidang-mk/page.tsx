import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Network,
  Plus,
  Trash2,
  Filter,
  BookOpen,
  Building2,
  AlertTriangle,
  Loader2,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import BidangMKForm from '@/components/forms/BidangMKForm';
import { useBidang, useProdi } from '@/lib/hooks/useRefData';
import { useBidangMKList, useAddBidangMK, useDeleteBidangMK } from '@/lib/hooks/useWadek';
import type { BidangMataKuliahItem, AddBidangMKPayload } from '@/types';

export default function WadekBidangMKPage() {
  const { data: bidangList = [] } = useBidang();
  const { data: prodiList = [] } = useProdi();

  const [filterBidang, setFilterBidang] = useState<string>('all');
  const [filterProdi, setFilterProdi] = useState<string>('all');

  const { data: mappingList = [], isLoading } = useBidangMKList({
    bidang_id: filterBidang === 'all' ? undefined : Number(filterBidang),
    prodi_id: filterProdi === 'all' ? undefined : Number(filterProdi),
  });

  const addMutation = useAddBidangMK();
  const deleteMutation = useDeleteBidangMK();

  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<BidangMataKuliahItem | null>(null);

  const handleAddMapping = async (payload: AddBidangMKPayload) => {
    try {
      await addMutation.mutateAsync(payload);
      toast.success('Pemetaan Berhasil Ditambahkan', {
        description: 'Mata kuliah kini dapat dipilih mahasiswa yang mengikuti perlombaan di bidang tersebut.',
      });
      setIsAddOpen(false);
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || err?.message || 'Gagal menambahkan pemetaan.';
      toast.error('Gagal Menambahkan', { description: errorMsg });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success('Pemetaan Berhasil Dihapus', {
        description: 'Relasi bidang dan mata kuliah telah dihapus.',
      });
      setDeleteTarget(null);
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || err?.message || 'Gagal menghapus pemetaan.';
      toast.error('Gagal Menghapus', { description: errorMsg });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Pemetaan Bidang & Mata Kuliah
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Petakan bidang keilmuan perlombaan terhadap mata kuliah program studi yang memenuhi syarat
            konversi SKS.
          </p>
        </div>
        <div>
          <Button onClick={() => setIsAddOpen(true)} className="gap-2 shadow-sm">
            <Plus className="w-4 h-4" />
            Tambah Pemetaan
          </Button>
        </div>
      </div>

      {/* Filter & Table Card */}
      <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Network className="w-4 h-4 text-primary" /> Daftar Pemetaan Aktif
            </CardTitle>
            <CardDescription className="text-xs">
              Menampilkan {mappingList.length} relasi pemetaan bidang ke mata kuliah
            </CardDescription>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />

            {/* Filter Bidang */}
            <Select value={filterBidang} onValueChange={setFilterBidang}>
              <SelectTrigger className="w-[160px] h-8 text-xs">
                <SelectValue placeholder="Semua Bidang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Bidang</SelectItem>
                {bidangList.map((b) => (
                  <SelectItem key={b.id} value={String(b.id)}>
                    {b.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter Prodi */}
            <Select value={filterProdi} onValueChange={setFilterProdi}>
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue placeholder="Semua Prodi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Prodi</SelectItem>
                {prodiList.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.singkatan} - {p.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {isLoading ? (
            <div className="p-12 text-center bg-transparent">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Memuat data pemetaan...</p>
            </div>
          ) : mappingList.length === 0 ? (
            <div className="text-center py-14 px-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Tidak Ada Pemetaan Ditemukan
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Belum ada pemetaan bidang ke mata kuliah untuk filter yang dipilih.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAddOpen(true)}
                className="text-xs gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Pemetaan Baru
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-800/80 text-xs">
                  <TableRow>
                    <TableHead className="w-[60px]">No</TableHead>
                    <TableHead>Bidang Lomba</TableHead>
                    <TableHead>Mata Kuliah</TableHead>
                    <TableHead>Program Studi</TableHead>
                    <TableHead className="text-center">SKS</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappingList.map((item, idx) => {
                    const mk = item.mata_kuliah || item.mataKuliah;
                    const prodi = mk?.prodi;
                    return (
                      <TableRow key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 text-xs transition-colors">
                        <TableCell className="font-mono text-slate-400 font-semibold">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="font-semibold text-slate-900 dark:text-slate-100">
                          {item.bidang?.nama || `Bidang #${item.bidang_id}`}
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-slate-900 dark:text-slate-100">{mk?.nama_mk || '-'}</div>
                          <div className="font-mono text-[11px] text-muted-foreground">
                            {mk?.kode_mk}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
                            {prodi?.singkatan || '-'}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                            {mk?.sks || 0} SKS
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteTarget(item)}
                            className="h-8 px-2 text-xs gap-1 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-300"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Hapus
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Mapping Dialog */}
      <BidangMKForm
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        existingMappings={mappingList}
        isLoading={addMutation.isPending}
        onSave={handleAddMapping}
      />

      {/* Confirmation Delete Dialog */}
      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
              Hapus Pemetaan Mata Kuliah
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Anda yakin ingin menghapus pemetaan bidang{' '}
              <strong className="text-slate-800 dark:text-slate-200">{deleteTarget?.bidang?.nama}</strong> dengan mata
              kuliah{' '}
              <strong className="text-slate-800 dark:text-slate-200">
                {(deleteTarget?.mata_kuliah || deleteTarget?.mataKuliah)?.nama_mk}
              </strong>
              ?
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-900 dark:text-rose-200">
            Setelah dihapus, mata kuliah ini tidak akan lagi muncul dalam pilihan konversi SKS untuk
            bidang lomba tersebut.
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleteMutation.isPending}
              className="text-xs"
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="text-xs gap-1.5 bg-rose-600 hover:bg-rose-700"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  Ya, Hapus Pemetaan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
